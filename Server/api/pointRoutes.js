const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');
const imageStorage = require('../middlewares/imageStorage');
const pointMidl = require('../middlewares/pointMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/points',[authMidl.verifyToken], pointController.getPoints);
router.post('/:app_code/points', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), pointMidl.checkCreate], pointController.postPoint);
router.put('/:app_code/points/:point_code', [authMidl.verifyToken, appMidl.checkOwner, pointMidl.checkPoint, imageStorage.upload.single('file'), pointMidl.checkCode], pointController.updatePoint);
router.delete('/:app_code/points/:point_code', [authMidl.verifyToken, appMidl.checkOwner, pointMidl.checkPoint], pointController.deletePoint);
router.get('/:app_code/points/:point_code', [authMidl.verifyToken], pointController.getPoint);

module.exports = router;
