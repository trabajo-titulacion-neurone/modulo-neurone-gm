const Challenge = require('../models/challenge');
const Action = require('../models/action');
const Point = require('../models/point');
const Badge = require('../models/badge');
const Player = require('../models/player');
const ActionChallenge = require('../models/actionChallenge');
const ChallengeRequisite = require('../models/challengeRequisite');
const ChallengePlayer = require('../models/challengePlayer');
const codeGenerator = require('../services/codeGenerator');
const challengeController = {};

challengeController.getChallenges = async (req, res) => {
    const app_code = req.params.app_code;
    await Challenge.find({ app_code: app_code }, (err, data) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    }).populate('actions_required.action').populate('challenges_required.challenge').populate( 'points_awards.point').populate('badge')
};

challengeController.postChallenge = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, description, start_date, end_date, actions_required, challenges_required, badge_id, points_awards, badge_award} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'chall');
    const timesRepeated = await Challenge.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    let actions = [];
    let challenges = [];
    let points = [];
    if(actions_required && actions_required.length > 0){
        for(let i = 0; i<actions_required.length; i++){
            await Action.findOne({code: actions_required[i].action_code}, (err, action)=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                if(!action){
                    return res.status(400).send("Action Required with code: "+actions_required[i].action_code+" doesn't exist!");
                }
                actions.push({action: action._id, times_required: actions_required[i].times_required});
            })
        }
    }
    if(challenges_required && challenges_required.length > 0){
        for(let i = 0; i<challenges_required.length; i++){
            await Challenge.findOne({code: challenges_required[i].challenge_code}, (err, challenge)=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                if(!challenge){
                    return res.status(400).send("Prerequisite Challenge with code: "+challenge_required[i].challenge_code+" doesn't exist!");
                }
                challenges.push({challenge: challenge._id});
            })
        }}
    if(points_awards && points_awards.length > 0){
            for(let i = 0; i<points_awards.length; i++){
                await Point.findOne({code: points_awards[i].point_code}, (err, point)=>{
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    if(!point){
                        return res.status(400).send("Reward Point with code: "+points_awards[i].point_code+" doesn't exist!");
                    }
                    points.push({point: point._id, amount: points_awards[i].amount});
                })
            }
    }
    const challenge = new Challenge({
        name: name,
        description: description,
        app_code: app_code,
        start_date: start_date,
        end_date: end_date,
        code: code,
        actions_required: actions,
        challenges_required: challenges,
        points_awards: points,
    });
    if(badge_award){
        badge = await Badge.findOne({code: badge_award}, (err, badge) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            if(!badge){
                return res.status(400).send("Reward Badge with code: "+badge_award+" doesn't exist!");
            }
            challenge.badge = badge._id;
        })
    }
    const players = await Player.find({ app_code: app_code }, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    const actionsChallenges = [];
    const challengeRequisites = [];
    const challengesPlayers = [];
    for (let i = 0 ; i <players.length ; i++){
        players[i].allCompleted = true;
        for(let j = 0; j < challenge.challenges_required.length; j++){
            await ChallengePlayer.findOne({player: players[i]._id, challenge: challenge.challenges_required[j].challenge}, (err, challPlayer)=> {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                if(!challPlayer.completed){
                    players[i].allCompleted = false;
                }
                challengeRequisites.push(new ChallengeRequisite({
                    app_code: app_code,
                    player: players[i]._id,
                    challenge: challenge._id,
                    challenge_required: challenge.challenges_required[j].challenge,
                    completed: challPlayer.completed,
                    start_date: start_date,
                    end_date: end_date
                }))
            })
        }
    }
    for (let i = 0 ; i < players.length ; i++){
        let newChallengePlayer = new ChallengePlayer({
            app_code: app_code,
            player: players[i]._id,
            challenge: challenge._id,
            completed: false,
            start_date: start_date,
            end_date: end_date,
            badge_id: badge_id,
        });
        if(challenges_required && challenges_required.length > 0){
            newChallengePlayer.active = players[i].allCompleted;
        }
        else{
            newChallengePlayer.active = true;
        }
        challengesPlayers.push(newChallengePlayer);
        for( let j = 0; j < challenge.actions_required.length; j++){
            let newActionChallenge = new ActionChallenge({
                app_code: app_code,
                player: players[i]._id,
                challenge: challenge._id,
                challenge_name: name,
                action: challenge.actions_required[j].action._id,
                action_counter: 0,
                total_actions_required: challenge.actions_required[j].times_required,
                start_date: start_date,
                end_date: end_date,
                completed: false
            });
            if(challenges_required && challenges_required.length > 0){
                newActionChallenge.active = players[i].allCompleted;
            }
            else{
                newActionChallenge.active = true;
            }
            actionsChallenges.push(newActionChallenge);
        }
    }
    await ActionChallenge.insertMany(actionsChallenges,(err) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ChallengePlayer.insertMany(challengesPlayers, (err) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ChallengeRequisite.insertMany(challengeRequisites,(err) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await challenge.save( (err, challenge) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            challenge
        });
    });
};

challengeController.getChallengesRequisites = async (req, res)=>{
    const app_name = req.params.app_name;
    await ChallengeRequisite.find({ app_name: app_name}, (err, data) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    });
}

challengeController.updateChallenge = async (req, res) => {
    const app_code = req.params.app_code;
    const challenge_code = req.params.challenge_code;
    const challenge = await Challenge.findOne({app_code: app_code, code: challenge_code}, err => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(req.body.name){
        challenge.name = req.body.name;
    }
    if(req.body.code){
        challenge.code = req.body.code;
    }
    if(req.body.description){
        challenge.description = req.body.description;
    }
    if(req.body.start_date){
        challenge.start_date = req.body.start_date;
    }
    if(req.body.end_date){
        challenge.end_date = req.body.end_date;
    }
    if(req.body.badge_award){
        let badge = await Badge.findOne({code: req.body.badge_award}, (err, badge) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        if(!badge){
            return res.status(400).send("Reward Badge with code: "+badge_award+" doesn't exist!");
        }
        challenge.badge = badge._id;
    }
    let actions = [];
    let challenges = [];
    let points = [];
    if(req.body.actions_required && req.body.actions_required.length > 0){
        for(let i = 0; i<req.body.actions_required.length; i++){
            let action = await Action.findOne({code: req.body.actions_required[i].action_code}, (err, action)=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
            if(!action){
                return res.status(400).send("Action Required with code: "+actions_required[i].action_code+" doesn't exist!");
            }
            actions.push({action: action._id, times_required: req.body.actions_required[i].times_required});
        }
        challenge.actions_required = actions;
    }
    if(req.body.challenges_required && req.body.challenges_required.length > 0){
        for(let i = 0; i<req.body.challenges_required.length; i++){
            let challenge = await Challenge.findOne({code: req.body.challenges_required[i].challenge_code}, (err, challenge)=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
            if(!challenge){
                return res.status(400).send("Prerequisite Challenge with code: "+challenge_required[i].challenge_code+" doesn't exist!");
            }
            if(challenge.code.equals(challenge_code)){
                return res.status(400).send("You can't have the challenge as a prerequisite of the challenge itself");
            }
            challenges.push({challenge: challenge._id});
        }
        challenge.challenges_required = challenges;
    }
    if(req.body.points_awards && req.body.points_awards.length > 0){
        for(let i = 0; i<req.body.points_awards.length; i++){
            let point = await Point.findOne({code: req.body.points_awards[i].point_code}, (err, point)=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
            if(!point){
                return res.status(400).send("Reward Point with code: "+points_awards[i].point_code+" doesn't exist!");
            }
            points.push({point: point._id, amount: req.body.points_awards[i].amount});
        }
        challenge.points_awards = points;
    }
    await challenge.save((err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        console.log(data)
        res.status(200).json({
            ok: true,
            data
        });
    })
};

challengeController.deleteChallenge = async (req, res) => {
    const challenge_code = req.params.challenge_code;
    const challenge = await Challenge.findOne( { code: challenge_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await ActionChallenge.deleteMany({challenge: challenge._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ChallengePlayer.deleteMany({challenge: challenge._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ChallengeRequisite.deleteMany({challenge: challenge._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await ChallengeRequisite.deleteMany({challenge_required: challenge._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Challenge.deleteOne( { code: challenge_code}, (err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    })
};

challengeController.getChallenge = async  (req, res) => {
    const challenge_code = req.params.challenge_code;
    await Challenge.findOne( { code: challenge_code}, (err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    })
};


module.exports = challengeController;
