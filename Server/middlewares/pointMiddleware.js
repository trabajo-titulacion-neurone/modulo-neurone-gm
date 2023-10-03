const Point = require('../models/point');

checkCreate = (req, res, next) => {
    //Check body fields
    const {name, abbreviation, initial_points, max_points, daily_max, is_default, hidden} = req.body;
    if(!name || !abbreviation || (!initial_points && !(initial_points === 0)) || (!max_points && !(max_points === 0)) || (!daily_max && !(daily_max === 0)) || !is_default || !hidden){
        res.status(400).send('Write all the fields');
        return;
    }
    next();
};

checkPoint = (req, res, next) => {
    const app_code = req.params.app_code;
    const point_code = req.params.point_code;
    // Check if Point exists
    Point.findOne({
        app_code: app_code,
        code: point_code
    }).exec((err, point) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!point) {
            res.status(400).send({ message: "Failed! Point doesn't exist!" });
            return;
        }
        next();
    });
}

checkCode = (req, res, next) =>{
    const app_code = req.params.app_code;
    const point_code = req.params.point_code;
    if(req.body.code && req.body.code !== point_code){
        Point.findOne({
            app_code: app_code,
            code: req.body.code
        }).exec((err, point) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (point) {
                res.status(400).send({ message: "Failed! Point Code already exists" });
                return;
            }
            next();
        });
    }
    else{
        next();
    }
}


const pointMiddleware = {
    checkCreate,
    checkPoint,
    checkCode
};

module.exports = pointMiddleware;