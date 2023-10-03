const Leaderboard = require('../models/leaderboard');

checkCreate = (req, res, next) => {
    //Check body fields
    const {name, parameter, element_code} = req.body;
    if(!name || !parameter || !element_code){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkLeaderboard = (req, res, next) => {
    const app_code = req.params.app_code;
    const leaderboard_code = req.params.leaderboard_code;
    // Check if Action exists
    Leaderboard.findOne({
        app_code: app_code,
        code: leaderboard_code
    }).exec((err, leaderboard) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!leaderboard) {
            res.status(400).send({ message: "Failed! Leaderboard doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const leaderboard_code = req.params.leaderboard_code;
    if(req.body.code && req.body.code !== leaderboard_code){
        Leaderboard.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, leaderboard) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (leaderboard) {
                res.status(400).send({ message: "Failed! Leaderboard Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const leaderboardMiddleware = {
    checkCreate,
    checkLeaderboard,
    checkCode
};

module.exports = leaderboardMiddleware;