const Group = require('../models/group');

checkCreate = (req, res, next) => {
    //Check body fields
    const {name} = req.body;
    if(!name){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkGroup = (req, res, next) => {
    const app_code = req.params.app_code;
    const group_code = req.params.group_code;
    // Check if Group exists
    Group.findOne({
        app_code: app_code,
        code: group_code
    }).exec((err, action) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!action) {
            res.status(400).send({ message: "Failed! Group doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const group_code = req.params.group_code;
    if(req.body.code && req.body.code !== group_code){
        Group.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, group) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (group) {
                res.status(400).send({ message: "Failed! Group Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const groupMiddleware = {
    checkCreate,
    checkGroup,
    checkCode
};

module.exports = groupMiddleware;