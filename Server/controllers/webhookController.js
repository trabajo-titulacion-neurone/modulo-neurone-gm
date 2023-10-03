const Webhook = require('../models/webhook');

webhookController = {};

webhookController.getWebhooks = async (req, res) => {
    const app_code = req.params.app_code;
    await Webhook.findOne( { app_code: app_code }, (err, webhook) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            webhook
        });
    })
}

webhookController.updateWebhooks = async (req, res) => {
    const app_code = req.params.app_code;
    const {givePointsUrl, challengeCompletedUrl, badgeAcquiredUrl, levelUpUrl} = req.body;
    await Webhook.findOne( { app_code: app_code}, (err, webhook) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(givePointsUrl){
            webhook.givePointsUrl = givePointsUrl;
        }
        if(challengeCompletedUrl){
            webhook.challengeCompletedUrl = challengeCompletedUrl;
        }
        if(badgeAcquiredUrl){
            webhook.badgeAcquiredUrl = badgeAcquiredUrl;
        }
        if(levelUpUrl){
            webhook.levelUpUrl = levelUpUrl;
        }
        webhook.save((err , data) => {
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


module.exports = webhookController;