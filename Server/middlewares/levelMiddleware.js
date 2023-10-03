const Level = require('../models/level');

checkCreate = (req, res, next) => {
    //Check body fields
    const {name, description, point_required, point_threshold} = req.body;
    if(!name || !description || !point_required || (!point_threshold && point_threshold !== 0)){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkLevel = (req, res, next) => {
    const app_code = req.params.app_code;
    const level_code = req.params.level_code;
    // Check if Level exists
    Level.findOne({
        app_code: app_code,
        code: level_code
    }).exec((err, level) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!level) {
            res.status(400).send({ message: "Failed! Level doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const level_code = req.params.level_code;
    if(req.body.code && req.body.code !== level_code){
        Level.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, level) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (level) {
                res.status(400).send({ message: "Failed! Level Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const levelMiddleware = {
    checkCreate,
    checkLevel,
    checkCode
};

module.exports = levelMiddleware;