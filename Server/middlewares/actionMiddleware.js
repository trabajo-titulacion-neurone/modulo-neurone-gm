const Action = require('../models/action');

checkCreate = (req, res, next) => {
    //Check body fields
    const {name, description, repeatable} = req.body;
    if(!name || !description || !repeatable){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkAction = (req, res, next) => {
    const app_code = req.params.app_code;
    const action_code = req.params.action_code;
    // Check if Action exists
    Action.findOne({
        app_code: app_code,
        code: action_code
    }).exec((err, action) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!action) {
            res.status(400).send({ message: "Failed! Action doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const action_code = req.params.action_code;
    if(req.body.code && req.body.code !== action_code){
        Action.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, action) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (action) {
                res.status(400).send({ message: "Failed! Action Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const actionMiddleware = {
    checkCreate,
    checkAction,
    checkCode
};

module.exports = actionMiddleware;