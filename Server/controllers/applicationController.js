const Application = require('../models/application');
const Webhook = require('../models/webhook');
const Group = require('../models/group');
const Action = require('../models/action');
const Player = require('../models/player');
const Point = require('../models/point');
const Challenge = require('../models/challenge');
const Level = require('../models/level');
const Badge = require('../models/badge');
const Leaderboard = require('../models/leaderboard');

const { normalize } = require('normalize-diacritics');

const applicationController = {};

//This method returns all applications
applicationController.getApps = async  (req, res) => {
    await Application.find({},{_id:0}, (err, data) => {
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

//This method brings all the applications of a user
applicationController.getUserApps = async  (req, res) => {
    const username = req.params.username;
    await Application.find({owner: username},{_id:0}, (err, data) => {
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

applicationController.postApp = async (req, res) => {
    const {name, description} = req.body;
    const normalize_name = await normalize(name);
    const code = normalize_name.split(' ').join('-');
    const app = new Application({
        name: name,
        description: description,
        owner: req.authUsername,
        code: code,
        focus: false,
    });
    const webhook = new Webhook({
        app_code: code,
        givePointsUrl: '',
        challengeCompletedUrl: '',
        badgeAcquiredUrl: ''

    });
    await webhook.save( err=> {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await app.save( (err,data) => {
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

applicationController.updateApp = async (req, res) => {
    const app_code = req.params.app_code;
    await Application.updateOne( { code: app_code}, req.body, (err, data) => {
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

applicationController.deleteApp = async (req, res) => {
    const app_code = req.params.app_code;
    await Webhook.deleteMany({app_code: app_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Application.deleteOne( { code: app_code}, (err, data) => {
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

applicationController.getApp = async  (req, res) => {
    const app_code = req.params.app_code;
    await Application.findOne( {code: app_code},{ _id: 0}, (err, data) => {
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

//Este método trae la aplicación activa de un usuario
applicationController.getFocusApp= async (req, res)=> {
    const username = req.params.username;
    await Application.findOne( {focus: true, owner: username}, (err, data) => {
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

applicationController.changeFocusApp = async(req, res) => {
    const username = req.params.username;
    const new_focus_code = req.body.app_code;
    if(!new_focus_code){
        res.status(400).send('Write the code of the new active app');
        return;
    }
    await Application.updateOne({focus: true, owner: username}, {$set: {focus: false}}, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Application.updateOne({code: new_focus_code, owner: username},{$set: {focus: true}}, (err, data) => {
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

applicationController.appSummary = async(req, res) => {
    const app_code = req.params.app_code;
    let actions, points, levels, players, groups, challenges, badges;
    actions = await Action.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    points = await Point.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    levels = await Level.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    challenges = await Challenge.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    leaderboards = await Leaderboard.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    players = await Player.countDocuments({app_code: app_code}, err=> {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    badges = await Badge.countDocuments({app_code: app_code}, err=> {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    groups = await Group.countDocuments({app_code: app_code}, err => {
        if (err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    res.status(200).json({
        actions,
        points,
        levels,
        challenges,
        leaderboards,
        players,
        groups,
        badges
    });
}


module.exports = applicationController;
