const Action = require('../models/action');
const ActionPlayer = require('../models/actionPlayer');
const Challenge = require('../models/challenge');
const ActionChallenge = require('../models/actionChallenge');
const codeGenerator = require('../services/codeGenerator');
const imageStorage = require('../middlewares/imageStorage');

const actionController = {};

actionController.getActions = async (req, res) => {
    const app_code = req.params.app_code;
    await Action.find({ app_code: app_code }, {_id: 0}, (err, actions) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            actions
        });
    });
};

actionController.postAction = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, description, repeatable} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'action');
    const timesRepeated = await Action.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    const action = new Action({
        name: name,
        description: description,
        app_code: app_code,
        repeatable: repeatable,
        code: code
    });
    if(req.file){
        let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
        action.image_url = image_url;
        action.image_id = req.file.id;
    }
    await action.save( (err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    })
};

actionController.updateAction = async (req, res) => {
    const action_code = req.params.action_code;
    const {name, description, repeatable, code} = req.body;
    await Action.findOne( { code: action_code}, (err, action) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(name){
            action.name = name;
        }
        if(code){
            action.code = code;
        }
        if(description){
            action.description = description;
        }
        if(repeatable !== null){
            action.repeatable = repeatable;
        }
        if(req.file){
            if(action.image_id){
                imageStorage.gfs.delete(action.image_id);
            }
            let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
            action.image_url = image_url;
            action.image_id = req.file.id;
        }
        action.save((err , data) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                data
            });
        })
    })
};

actionController.deleteAction = async (req, res) => {
    const action_code = req.params.action_code;
    const action = await Action.findOne( { code: action_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(action.image_id){
        imageStorage.gfs.delete(action.image_id);
    }
    await ActionChallenge.deleteMany({action: action._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Challenge.find({"actions_required":{ $elemMatch: {action: action._id}}}, (err, challenges) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        for(let i = 0; i<challenges.length; i++){
            let index;
            let challActions = challenges[i].actions_required;
            for(let j = 0; j<challActions.length; j++){
                if(challActions[j].action.equals(action._id)){
                    index = j;
                    break;
                }
            }
            challenges[i].actions_required.splice(index, 1);
            challenges[i].save(err=>{
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
        }
    })
    await ActionPlayer.deleteMany({action: action._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Action.deleteOne( { _id: action._id}, (err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    })
};

actionController.getAction = async  (req, res) => {
    const action_code = req.params.action_code;
    await Action.findOne( { code: action_code}, {_id: 0}, (err, data) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    })
};

module.exports = actionController;
