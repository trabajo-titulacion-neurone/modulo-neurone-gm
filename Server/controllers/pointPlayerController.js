const Player = require('../models/player');
const Point = require('../models/point');
const PointService = require('../services/pointService');

const playerPointController = {};

playerPointController.givePoints = async (req, res) => {
    const app_code = req.params.app_code;
    const player_code = req.params.player_code;
    const {amount, point_code, date} = req.body;
    const point = await Point.findOne({code: point_code}, err =>{
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    const player = await Player.findOne({code: player_code}, err =>{
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await PointService.givePoints(app_code, point, player, amount, date, (err, data) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            data
        });
    })
}


module.exports = playerPointController;