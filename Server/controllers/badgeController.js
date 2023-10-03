const Badge = require('../models/badge');
const Challenge = require('../models/challenge');
const BadgePlayer = require('../models/badgePlayer');
const codeGenerator = require('../services/codeGenerator');
const imageStorage = require('../middlewares/imageStorage');

const badgeController = {};

badgeController.getBadges = async (req, res) => {
    const app_code = req.params.app_code;
    await Badge.find({ app_code: app_code }, {_id: 0}, (err, badges) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            badges
        });
    });
};

badgeController.postBadge =  async  (req, res) => {
    const app_code = req.params.app_code;
    const {title, description} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, title, 'badge');
    const timesRepeated = await Badge.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
    var badge = new Badge({
        title: title,
        description: description,
        code: code,
        app_code: app_code,
        image_url: image_url,
        image_id: req.file.id,
        times_earned: 0,
        last_time_earned: null
    });
    await badge.save( (err, data) => {
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

badgeController.updateBadge = async (req, res) => {
    const badge_code = req.params.badge_code;
    const {title, description, code} = req.body;
    await Badge.findOne( { code: badge_code}, (err, badge) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(title){
            badge.title = title;
        }
        if(code){
            badge.code = code;
        }
        if(description){
            badge.description = description;
        }
        if(req.file){
            if(badge.image_id){
                imageStorage.gfs.delete(badge.image_id);
            }
            let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
            badge.image_url = image_url;
            badge.image_id = req.file.id;
        }
        badge.save((err , data) => {
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
    })
};

badgeController.deleteBadge = async (req, res) => {
    const badge_code = req.params.badge_code;
    const badge = await Badge.findOne( { code: badge_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(badge.image_id){
        imageStorage.gfs.delete(badge.image_id);
    }
    await BadgePlayer.deleteMany({badge: badge._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Challenge.updateMany({
        badge: badge._id},
        {$set: {badge: null}}, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Badge.deleteOne( { _id: badge._id}, (err, data) => {
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

badgeController.getBadge = async  (req, res) => {
    const badge_code = req.params.badge_code;
    await Badge.findOne( { code: badge_code}, (err, data) => {
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


module.exports = badgeController;
