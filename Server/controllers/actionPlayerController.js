const ActionPlayer = require('../models/actionPlayer');
const Player = require('../models/player');
const Action = require('../models/action');
const ActionChallenge = require('../models/actionChallenge');
const ChallengeRequisite = require('../models/challengeRequisite');
const ChallengePlayer = require('../models/challengePlayer');
const Challenge = require('../models/challenge');
const BadgePlayer = require('../models/badgePlayer');

const PointService = require('../services/pointService');
const WebhookUtil = require('../services/webhookUtil');

const actionPlayerController = {};

actionPlayerController.getActionsPlayer = async (req, res) => {
    const app_code = req.params.app_code;
    const player_code = req.params.player_code;
    const player = await Player.findOne({code: player_code}, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ActionPlayer.find({ app_code: app_code, player: player._id }, (err, actions) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            actions
        });
    }).sort({date: -1}).populate('action');
};

actionPlayerController.postActionPlayer = async (req, res) => {
    const app_code = req.params.app_code;
    const player_code = req.params.player_code;
    const {action_code, date } = req.body;
    if(!action_code || !date){
        res.status(400).send('Write all the fields');
    }
    const player = await Player.findOne({code: player_code}, err => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    const action = await Action.findOne({code: action_code}, (err) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            })
        }
    });
    const actionsPlayer = await ActionPlayer.findOne({action: action._id, player: player._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            })
        }
    })
    if(!action.repeatable && actionsPlayer !== null){
        return res.status(400).send({ok: false, message: "This player has already did this action!"})
    }
    const actionPlayer = new ActionPlayer({
        app_code: app_code,
        action: action._id,
        player: player._id,
        date: date
    });
    await actionPlayer.save((err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    //An action is added within the action challenge model (which keeps track of how many actions the player has performed to complete a challenge)
    await ActionChallenge.updateMany({
        app_code: app_code,
        player: player._id,
        action: action._id, 
        active: true,
        completed: false,
        $and: [
            { $expr: {$gte: [new Date(date), "$start_date"]} },
            { $expr: {$lte: [new Date(date), "$end_date"]} }
        ]
        },
        {$inc: {action_counter: 1}
    });
    await ActionChallenge.updateMany({
        app_code: app_code, 
        player: player._id, 
        action: action._id,
        active: true, 
        $expr: {$gte:["$action_counter","$total_actions_required"]},
        $and: [
            { $expr: {$gte: [new Date(date), "$start_date"]} },
            { $expr: {$lte: [new Date(date), "$end_date"]} }
        ]},
        {$set: {completed: true}}, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    //An aggregation of all the actionChallenge entries is made, taking the challenge as the id and the value as the minimum of the completed field
    //This is because when a challenge has been completed, the minimum field completed will be true.
    await ActionChallenge.aggregate([
        {$match: {player:player._id, active: true, $and: [
            { $expr: {$gte: [new Date(date), "$start_date"]} },
            { $expr: {$lte: [new Date(date), "$end_date"]} }
        ]}},
        {$group: { _id: "$challenge", status: {$min: "$completed"}}}
    ], (err,data) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        for(let i = 0; i<data.length; i++){
            if(data[i].status){
                ChallengePlayer.findOne({app_code: app_code,player: player._id, challenge: data[i]._id},(err, challPlayer) => {
                    if (err) {
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    if(challPlayer.completed === false){
                        challPlayer.completed = true;
                        challPlayer.completion_date = Date.now();
                        challPlayer.save(err => {
                            if (err) {
                                return res.status(404).json({
                                    ok: false,
                                    err
                                });
                            }
                        })
                        ChallengeRequisite.updateMany({app_code: app_code, player: player._id, challenge_required: data[i]._id}, {$set: {completed: true}}, (err) => {
                            if (err) {
                                return res.status(404).json({
                                    ok: false,
                                    err
                                });
                            }
                            ChallengeRequisite.aggregate([
                                {$match: {player:player._id}},
                                {$group: { _id: "$challenge", status: {$min: "$completed"}}}
                            ], (err, challReqAgr) =>{
                                if (err) {
                                    return res.status(404).json({
                                        ok: false,
                                        err
                                    });
                                }
                                for(let n = 0; n<challReqAgr.length; n++){
                                    if(challReqAgr[n].status){
                                        ActionChallenge.updateMany({app_code: app_code, player: player._id, challenge: challReqAgr[n]._id, active: false}, {$set: {active: true}},
                                            err => {
                                                if(err){
                                                    return res.status(404).json({
                                                        ok: false,
                                                        err
                                                    });
                                                }
                                            }
                                        );
                                        ChallengePlayer.updateMany({app_code: app_code, player: player._id, challenge: challReqAgr[n]._id, active: false}, {$set: {active: true}},
                                            err => {
                                                if(err){
                                                    return res.status(404).json({
                                                        ok: false,
                                                        err
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            })
                        });
                        Challenge.findOne({_id: data[i]._id}, (err, chall) => {
                            if (err) {
                                return res.status(404).json({
                                    ok: false,
                                    err
                                });
                            }
                            WebhookUtil.trigger(app_code, 'challengeCompleted',  {
                                messageES: 'Has alcanzado el logro: "'+chall.name+'"',
                                messageEN: 'You have completed: "'+chall.name+'"',
                                challenge: chall,
                                name: 'challengeCompleted',
                                player: player,
                                acquisitionDate: date,
                                notificationDate: new Date()
                            }, (err, clientRes) => {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log(clientRes.data)
                                }
                            })
                            if(chall.badge){
                                const badgePlayer = new BadgePlayer({
                                    app_code: app_code,
                                    player: player._id,
                                    badge: chall.badge._id,
                                    acquisition_date: date,
                                })
                                badgePlayer.save(err =>{
                                    if (err) {
                                        return res.status(404).json({
                                            ok: false,
                                            err
                                        });
                                    }
                                    WebhookUtil.trigger(app_code, 'badgeAcquired',  {
                                        messageES: 'Has adquirido la insignia '+ chall.badge.title,
                                        messageEN: 'You have earned badge '+chall.badge.title,
                                        badge: chall.badge,
                                        name: 'badgeAcquired',
                                        player: player,
                                        acquisitionDate: date,
                                        notificationDate: new Date()
                                    }, (err, clientRes) => {
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            console.log(clientRes.data)
                                        }
                                    })
                                })
                            }
                            for(let i = 0; i<chall.points_awards.length; i++){
                                PointService.givePoints(app_code, chall.points_awards[i].point, player, chall.points_awards[i].amount, date, (err, serviceRes)=> {
                                    if (err) {
                                        return res.status(404).json({
                                            ok: false,
                                            err
                                        });
                                    }
                                })
                            }
                        }).populate('points_awards.point').populate('badge')
                    }
                });
            }
        }
    });
    res.status(200).json({
        ok: true,
        actionPlayer
    });
};

module.exports = actionPlayerController;
