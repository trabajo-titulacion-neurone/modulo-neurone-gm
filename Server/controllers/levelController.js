const Level = require('../models/level');
const Point = require('../models/point');
const Player = require('../models/player');
const LevelPlayer = require('../models/levelPlayer');
const PointPlayer = require('../models/pointPlayer');
const codeGenerator = require('../services/codeGenerator');
const imageStorage = require('../middlewares/imageStorage');

const levelController = {};

levelController.getLevels = async (req, res) => {
    const app_code = req.params.app_code;
    await Level.find({app_code: app_code}, {_id: 0}, (err, data) => {
        if (err)
        {
            return res.status(404).json({
                ok: false,
                err
            })
        }
        res.status(200).json({
            ok: true,
            data
        });
    }).populate('point_required');
};

levelController.postLevel = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, description, point_required, point_threshold} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'level');
    const timesRepeated = await Level.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    const point = await Point.findOne({code: point_required}, (err, point)=>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            })
        }
    });
    if(!point){
        res.status(400).send( "Failed! Point specified doesn't exist!");
    }
    else{
        const players = await Player.find({ app_code: app_code }, err => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        const level = new Level({
            name: name,
            description: description,
            app_code: app_code,
            point_required: point._id,
            point_threshold: point_threshold,
            code: code
        });
        if(req.file){
            let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
            level.image_url = image_url;
            level.image_id = req.file.id;
        }
        levelPlayers = [];
        for(let i = 0; i<players.length; i++){
            let pointPlayer = await PointPlayer.findOne({player: players[i]._id, point: point._id}, err =>{
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            })
            if(pointPlayer){
                let levelPlayer = new LevelPlayer({
                    app_code,
                    player: players[i]._id,
                    level: level._id,
                    point: point._id,
                    point_threshold,
                    acquired: false,
                    acquisition_date: null
                })
                if(pointPlayer.amount >= point_threshold){
                    levelPlayer.acquired = true;
                    levelPlayer.acquisition_date = new Date();
                }
                levelPlayers.push(levelPlayer);
            }
        }
        await LevelPlayer.insertMany(levelPlayers, err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await level.save( (err, data) => {
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
    }
};

levelController.updateLevel = async (req, res) => {
    const level_code = req.params.level_code;
    const {name, description, point_required, point_threshold, code} = req.body;
    let point;
    if(point_required){
        point = await Point.findOne({code: point_required}, (err)=>{
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                })
            }
            req.body.point_required = point._id;
        });
    }
    await Level.findOne( { code: level_code}, (err, level) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(name){
            level.name = name;
        }
        if(description){
            level.description = description;
        }
        if(code){
            level.code = code;
        }
        if(point_required){
            level.point_required = point._id;
        }
        if(point_threshold){
            level.point_threshold = point_threshold;
        }
        if(req.file){
            if(level.image_id){
                imageStorage.gfs.delete(level.image_id);
            }
            let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
            level.image_url = image_url;
            level.image_id = req.file.id;
        }
        level.save((err , data) => {
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

levelController.deleteLevel = async (req, res) => {
    const level_code = req.params.level_code;
    const level = await Level.findOne( { code: level_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(level.image_id){
        imageStorage.gfs.delete(level.image_id);
    }
    await LevelPlayer.deleteMany({level: level._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Level.deleteOne( { _id: level._id}, (err, data) => {
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

levelController.getLevel = async  (req, res) => {
    const level_id = req.params.level_id;
    await Level.findOne( { _id: level_id}, (err, data) => {
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


module.exports = levelController;
