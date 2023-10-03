const Point = require('../models/point');
const Player = require('../models/player');
const Challenge = require('../models/challenge');
const PointPlayer = require('../models/pointPlayer');
const codeGenerator = require('../services/codeGenerator');
const imageStorage = require('../middlewares/imageStorage');

const pointController = {};

pointController.getPoints = async (req, res) => {
    const app_code = req.params.app_code;
    await Point.find({ app_code: app_code }, {_id: 0}, (err, data) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    });
};

pointController.postPoint = async (req, res) => {
    const app_code = req.params.app_code;
    const {name, abbreviation, initial_points, max_points, daily_max, is_default, hidden} = req.body;
    let code = await codeGenerator.codeGenerator(app_code, name, 'point');
    const timesRepeated = await Point.countDocuments( { 'code' : { '$regex' : code, '$options' : 'i' } } );
    if(timesRepeated > 0){
        code = code+(timesRepeated+1).toString();
    }
    const point = new Point({
        name: name,
        abbreviation: abbreviation,
        app_code: app_code,
        initial_points: initial_points,
        max_points: max_points,
        daily_max: daily_max,
        is_default: is_default,
        hidden: hidden,
        code: code
    });
    if(req.file){
        let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
        point.image_url = image_url;
        point.image_id = req.file.id;
    }
    const players = await Player.find({ app_code: app_code }, (err) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    const pointPlayers = [];
    await point.save( err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    for(let i = 0; i<players.length; i++){
        pointPlayers.push(new PointPlayer({
            app_code: app_code,
            player: players[i]._id,
            point: point._id,
            amount: point.initial_points,
        }));
    }
    await PointPlayer.insertMany(pointPlayers, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    res.status(200).json({
        ok: true,
        data: point
    })
};

pointController.updatePoint = async (req, res) => {
    const point_code = req.params.point_code;
    const {name, abbreviation, initial_points, max_points, daily_max, is_default, hidden, code} = req.body;
    await Point.findOne( { code: point_code}, (err, point) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(name){
            point.name = name;
        }
        if(code){
            point.code = code;
        }
        if(abbreviation){
            point.abbreviation = abbreviation;
        }
        if(initial_points){
            point.initial_points = initial_points;
        }
        if(max_points){
            point.max_points = max_points;
        }
        if(daily_max){
            point.daily_max = daily_max;
        }
        if(is_default !== null){
            point.is_default = is_default;
        }
        if(hidden !== null){
            point.hidden = hidden;
        }
        if(req.file){
            if(point.image_id){
                imageStorage.gfs.delete(point.image_id);
            }
            let image_url = process.env.APP_URI+'/api/image/'+req.file.filename;
            point.image_url = image_url;
            point.image_id = req.file.id;
        }
        point.save((err , data) => {
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

pointController.deletePoint = async (req, res) => {
    const point_code = req.params.point_code;
    const point = await Point.findOne( { code: point_code}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(point.image_id){
        imageStorage.gfs.delete(point.image_id);
    }
    await PointPlayer.deleteMany({point: point._id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    await Challenge.find({"points_awards":{ $elemMatch: {point: point._id}}}, (err, challenges) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        for(let i = 0; i<challenges.length; i++){
            let index;
            let challPoints = challenges[i].points_awards;
            for(let j = 0; j<challPoints.length; j++){
                if(challPoints[j].point.equals(point._id)){
                    index = j;
                    break;
                }
            }
            challenges[i].points_awards.splice(index, 1);
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
    await Point.deleteOne( { _id: point._id}, (err, data) => {
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

pointController.getPoint = async  (req, res) => {
    const point_code = req.params.point_code;
    await Point.findOne( { code: point_code}, {_id: 0}, (err, data) => {
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

module.exports = pointController;
