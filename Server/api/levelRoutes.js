const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const imageStorage = require('../middlewares/imageStorage');
const lvlMidl = require('../middlewares/levelMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/levels',  [authMidl.verifyToken], levelController.getLevels);
router.post('/:app_code/levels', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), lvlMidl.checkCreate], levelController.postLevel);
router.put('/:app_code/levels/:level_code', [authMidl.verifyToken, appMidl.checkOwner, lvlMidl.checkLevel,  imageStorage.upload.single('file'), lvlMidl.checkCode], levelController.updateLevel);
router.delete('/:app_code/levels/:level_code', [authMidl.verifyToken, appMidl.checkOwner], levelController.deleteLevel);
router.get('/:app_code/levels/:level_code', [authMidl.verifyToken], levelController.getLevel);

module.exports = router;
