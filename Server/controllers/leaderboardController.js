const Leaderboard = require('../models/leaderboard');
const GeneratedLeaderboard = require('../models/generatedLeaderboard');
const ActionPlayer = require('../models/actionPlayer');
const Player = require('../models/player');
const Action = require('../models/action');
const Group = require('../models/group');
const Point = require('../models/point');
const PointPlayer = require('../models/pointPlayer');
const codeGenerator = require('../services/codeGenerator');

const leaderboardController = {};

leaderboardController.getLeaderboards = async (req, res) => {
    const app_code = req.params.app_code;
    await Leaderboard.find({ app_code: app_code }, {_id: 0}, (err, data) => {
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
};

leaderboardController.postLeaderboard = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, parameter, element_code} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'lb');
    const timesRepeated = await Leaderboard.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    var leaderboard = new Leaderboard({
        app_code: app_code,
        name: name,
        parameter: parameter,
        element_code: element_code,
        code: code
    });
    await leaderboard.save( (err, data) => {
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

leaderboardController.updateLeaderboard = async (req, res) => {
    const leaderboard_code = req.params.leaderboard_code;
    await Leaderboard.updateOne( { code: leaderboard_code}, req.body, (err, data) => {
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

leaderboardController.deleteLeaderboard = async (req, res) => {
    const leaderboard_code = req.params.leaderboard_code;
    await GeneratedLeaderboard.deleteOne({leaderboard_code: leaderboard_code}, (err) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await Leaderboard.deleteOne( { code: leaderboard_code}, (err, data) => {
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

leaderboardController.getLeaderboard = async  (req, res) => {
    const leaderboard_code = req.params.leaderboard_code;
    await Leaderboard.findOne( { code: leaderboard_code}, {_id: 0}, (err, data) => {
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

leaderboardController.makeLeaderboard = async (req, res)=> {
    const leaderboard_code = req.params.leaderboard_code;
    const app_code = req.params.app_code;
    const group_code = req.body.group_code;
    let group;
    let generatedLeaderboard;
    if(group_code){
        generatedLeaderboard = await GeneratedLeaderboard.findOne({leaderboard_code: leaderboard_code, group_code: group_code}, (err) =>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        group = await Group.findOne({code: group_code}, (err) =>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
    }
    else{
        generatedLeaderboard = await GeneratedLeaderboard.findOne({leaderboard_code: leaderboard_code, allPlayers: true}, (err) =>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
    }
    if(generatedLeaderboard && (new Date()).getTime() - generatedLeaderboard.last_update.getTime() < 2000){
        res.status(200).json({
            ok: true,
            leaderboardResult: generatedLeaderboard.table
        });
    }
    else{
        const leaderboard = await Leaderboard.findOne({code: leaderboard_code}, err =>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        let players;
        if(group_code){
            players = await Player.find({app_code: app_code, group: group._id}, err =>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
        }
        else{
            players = await Player.find({app_code: app_code}, err =>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
        }
        const leaderboardResult = [];
        if(leaderboard.parameter ==='actions'){
            const action  = await Action.findOne({app_code: app_code, code: leaderboard.element_code}, err=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            });
            for(let i = 0; i<players.length; i++){
                let count = await ActionPlayer.countDocuments({app_code: app_code, action: action._id, player: players[i]._id}, err=>{
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                })
                leaderboardResult.push({name: players[i].name, last_name: players[i].last_name, code: players[i].code, amount: count})
            }
        }
        else if (leaderboard.parameter === 'points'){
            const point  = await Point.findOne({app_code: app_code, code: leaderboard.element_code}, err=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            });
            for(let i = 0; i<players.length; i++){
                let pointPlayer = await PointPlayer.findOne({app_code: app_code, point: point._id, player: players[i]._id}, err=>{
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                })
                leaderboardResult.push({name: players[i].name, last_name: players[i].last_name, code: players[i].code, amount: pointPlayer.amount})
            }
        }
        leaderboardResult.sort((a, b) => {
            if(a.amount > b.amount){
                return -1;
            }
            if(a.amount < b.amount){
                return 1;
            }
            return 0;
        })
        for(let i = 0; i<leaderboardResult.length; i++){
            leaderboardResult[i].rank = i+1;
        }
        if( generatedLeaderboard ){
            generatedLeaderboard.last_update = new Date();
            generatedLeaderboard.table = leaderboardResult;
        }
        else{
            generatedLeaderboard = new GeneratedLeaderboard({
                app_code,
                leaderboard: leaderboard._id,
                leaderboard_code: leaderboard.code,
                last_update: new Date(),
                allPlayers: true,
                table: leaderboardResult
            });
            if(group_code){
                generatedLeaderboard.group_code = group_code;
                generatedLeaderboard.allPlayers = false;
            }
        }
        await generatedLeaderboard.save(err=>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        res.status(200).json({
            ok: true,
            leaderboardResult
        });
    }
};


module.exports = leaderboardController;
