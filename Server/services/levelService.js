const webhookUtil = require('./webhookUtil');
const LevelPlayer = require('../models/levelPlayer');

const checkLevelUp = async (pointPlayer, callback) => {
    app_code = pointPlayer.app_code;
    pointAmount = pointPlayer.amount;
    player = pointPlayer.player;
    point = pointPlayer.point;
    levelPlayers = await LevelPlayer.find({player: player, point: point, acquired: false, point_threshold: {$lt: pointAmount}}, err=>{
        if(err){
            callback(err);
        }
    }).populate('level')
    for(let i = 0; i<levelPlayers.length; i++){
        await webhookUtil.trigger(app_code, 'levelUp', {messageES: 'Has alcanzado el nivel '+levelPlayers[i].level.name,
            messageEN: 'You have reached level '+levelPlayers[i].level.name,
            level: levelPlayers.level,
            name: 'levelUp',
            player: player,
            acquisitionDate: new Date(),
            notificationDate: new Date()
        }, (err, clientRes) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(clientRes.data)
            }
        })
        levelPlayers[i].acquired = true;
        levelPlayers[i].acquisition_date = new Date();
        await levelPlayers[i].save( err => {
            if(err){
                callback(err);
            }
        });
    }
    callback(null, {ok: true});
}

const levelService = {
    checkLevelUp
};

module.exports = levelService;