const PointPlayer = require('../models/pointPlayer');
const webhookUtil = require('../services/webhookUtil');
const levelService = require('../services/levelService');

const givePoints = async (app_code, point, player, amount, date, callback) => {
    const pointPlayer = await PointPlayer.findOne({point: point._id, player: player._id}, (err)=>{
        if (err) {
            callback(err);
        }
    })
    if(pointPlayer){
        console.log(point.max_points - pointPlayer.amount > 0);
        if(point.max_points === -1 || point.max_points - pointPlayer.amount < 0){
            pointPlayer.amount = pointPlayer.amount + amount;
            if(point.max_points !== -1 && pointPlayer.amount > point.max_points){
                pointPlayer.amount = point.max_points;
            }
            await webhookUtil.trigger(app_code, 'givePoints', {
                messageES: 'Has recibido '+amount.toString()+' puntos de '+point.name,
                messageEN: 'You have received '+amount.toString()+' points of '+point.name,
                point: point,
                name: 'givePoints',
                player: player,
                amount: amount,
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
            await levelService.checkLevelUp(pointPlayer, (err, data) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(data)
                }
            })
            await pointPlayer.save((err, data) => {
                if (err) {
                    callback(err);
                }
                callback(null, data);
            })
        }
        else{
            callback(null, {ok: true,
                message: "The maximum number of points has already been reached"
            });
        }
    }
    else{
        callback(null, {ok: false,
            message: "Error: Player register of this point doesn't exist"
        });
    }
}

const pointService = {
    givePoints
};

module.exports = pointService;