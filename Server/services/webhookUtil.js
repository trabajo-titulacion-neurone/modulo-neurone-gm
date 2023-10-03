const axios = require("axios");
const Webhook = require('../models/webhook');

const trigger = async (app_code, name, data, callback) => {
    const webhook = await Webhook.findOne({app_code: app_code}, err => {
        if (err) {
            callback( err );
        }
    })
    let url = "";
    if(!webhook){
        callback( "Webhook doesn't exist!" );
    }
    if(name === 'givePoints'){
        url = webhook.givePointsUrl;
    }
    else if(name === 'challengeCompleted'){
        url = webhook.challengeCompletedUrl;
    }
    else if(name === 'badgeAcquired'){
        url = webhook.badgeAcquiredUrl;
    }
    else if(name === 'levelUp'){
        url = webhook.levelUpUrl;
    }
    else{
        callback( "Webhook name doesn't exist!" );
    }
    await axios.post(url, data).then((axiosRes) => {
        callback(null, axiosRes);
    }).catch((err) => {
        callback(err);
    });
}

const webhookUtil = {
    trigger
};

module.exports = webhookUtil;