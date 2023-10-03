const ActionChallenge = require('../models/actionChallenge');

const actionChallengeController = {};

actionChallengeController.getActionsChallenges = async (req, res) => {
    const app_code = req.params.app_code;
    await ActionChallenge.find({ app_code: app_code}, (err, data) => {
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
    }).populate('action').populate('player');
};



module.exports = actionChallengeController;
