const Group = require('../models/group');
const codeGenerator = require('../services/codeGenerator');

const groupController = {};

groupController.getGroups = async (req, res) => {
    const app_code = req.params.app_code;
    await Group.find({ app_code: app_code }, {_id: 0}, (err, groups) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            groups
        });
    });
};

groupController.postGroup = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, sourceId} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'group');
    const timesRepeated = await Group.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    const group = new Group({
        name: name,
        app_code: app_code,
        code: code
    });
    if(sourceId){
        group.sourceId = sourceId;
    }
    await group.save( (err, data) => {
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

groupController.updateGroup = async (req, res) => {
    const group_code = req.params.group_code;
    const {name, sourceId, code} = req.body;
    await Group.findOne( { code: group_code}, (err, group) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(name){
            group.name = name;
        }
        if(code){
            group.code = code;
        }
        if(sourceId){
            group.sourceId = sourceId;
        }
        group.save((err , data) => {
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

groupController.deleteGroup = async (req, res) => {
    const group_code = req.params.group_code;
    const group = await Group.findOne( { code: group_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await Player.updateMany({group: group._id}, { $unset: {"group" : 1}}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    await Group.deleteOne( { _id: group._id}, (err, data) => {
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

groupController.getGroup = async  (req, res) => {
    const group_code = req.params.group_code;
    await Group.findOne( { code: group_code}, {_id: 0}, (err, data) => {
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

module.exports = groupController;
