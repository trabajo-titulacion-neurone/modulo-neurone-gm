const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const imageStorage = require('../middlewares/imageStorage');
const badgeMidl = require('../middlewares/badgeMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/badges', [authMidl.verifyToken] ,badgeController.getBadges);
router.post('/:app_code/badges', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), badgeMidl.checkCreate], badgeController.postBadge);
router.put('/:app_code/badges/:badge_code', [authMidl.verifyToken, appMidl.checkOwner, badgeMidl.checkBadge,  imageStorage.upload.single('file'), badgeMidl.checkCode] , badgeController.updateBadge);
router.delete('/:app_code/badges/:badge_code', [authMidl.verifyToken, appMidl.checkOwner], badgeController.deleteBadge);
router.get('/:app_code/badges/:badge_code', [authMidl.verifyToken], badgeController.getBadge);
 
module.exports = router;
