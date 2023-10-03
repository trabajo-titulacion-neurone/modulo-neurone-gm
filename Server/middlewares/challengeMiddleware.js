const Challenge = require('../models/challenge');

checkBody = (req, res, next) => {
    //Check body fields
    const {name, description, start_date, end_date} = req.body;
    if(!name || !description || !start_date || !end_date){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkChallenge = (req, res, next) => {
    const app_code = req.params.app_code;
    const challenge_code = req.params.challenge_code;
    // Check if Action exists
    Challenge.findOne({
        app_code: app_code,
        code: challenge_code
    }).exec((err, challenge) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!challenge) {
            res.status(400).send({ message: "Failed! Challenge doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const challenge_code = req.params.challenge_code;
    if(req.body.code && req.body.code !== challenge_code){
        Challenge.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, challenge) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (challenge) {
                res.status(400).send({ message: "Failed! Challenge Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const challengeMiddleware = {
    checkBody,
    checkChallenge,
    checkCode
};

module.exports = challengeMiddleware;