const Badge = require('../models/badge');

checkCreate = (req, res, next) => {
    //Check body fields
    const {title, description} = req.body;
    if(!title || !description){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkBadge = (req, res, next) => {
    const app_code = req.params.app_code;
    const badge_code = req.params.badge_code;
    // Check if Badge exists
    Badge.findOne({
        app_code: app_code,
        code: badge_code
    }).exec((err, badge) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!badge) {
            res.status(400).send({ message: "Failed! Badge doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const badge_code = req.params.badge_code;
    if(req.body.code && req.body.code !== badge_code){
        Badge.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, badge) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (badge) {
                res.status(400).send({ message: "Failed! Badge Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const badgeMiddleware = {
    checkCreate,
    checkBadge,
    checkCode
};

module.exports = badgeMiddleware;