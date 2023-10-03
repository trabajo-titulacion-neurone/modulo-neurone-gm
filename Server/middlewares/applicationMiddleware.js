const Application = require('../models/application');

checkAppCodeParam = (req, res, next) => {
    const app_code = req.params.app_code;
    if(!app_code){
        res.status(400).send('Failed! Write App Code!');
        return;
    }
    // Check if name exists
    Application.findOne({
        code: app_code
    }).exec((err, app) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!app) {
            res.status(400).send({ message: "Failed! App doesn't exist!" });
            return;
        }

        next();
    });
};

checkOwner = (req, res, next) => {
    const app_code = req.params.app_code;
    if(!app_code){
        res.status(400).send('Failed! Write App Code!');
        return;
    }
    // Check app belongs to logged user
    Application.findOne({
        code: app_code,
        owner: req.authUsername
    }).exec((err, app) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!app) {
            res.status(400).send({ message: "Failed! Not Authorized!" });
            return;
        }

        next();
    });
}

checkCreate = (req, res, next) => {
    //Check body fields
    const {name, description} = req.body;
    if(!name || !description){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

usernameMatch = (req, res, next) => {
    const username = req.params.username;
    if(username !== req.authUsername){
        res.status(400).send('Failed! Write App Code!');
        return;
    }
    next();
}


const applicationMiddleware = {
    checkAppCodeParam,
    checkOwner,
    usernameMatch,
    checkCreate
};

module.exports = applicationMiddleware;