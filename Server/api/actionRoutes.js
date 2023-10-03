const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const imageStorage = require('../middlewares/imageStorage');
const actMidl = require('../middlewares/actionMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/actions', [authMidl.verifyToken, appMidl.checkAppCodeParam],  actionController.getActions);
router.post('/:app_code/actions', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), actMidl.checkCreate], actionController.postAction);
router.put('/:app_code/actions/:action_code', [authMidl.verifyToken, appMidl.checkOwner, actMidl.checkAction,  imageStorage.upload.single('file'), actMidl.checkCode] , actionController.updateAction);
router.delete('/:app_code/actions/:action_code', [authMidl.verifyToken,  appMidl.checkOwner, actMidl.checkAction], actionController.deleteAction);
router.get('/:app_code/actions/:action_code', [authMidl.verifyToken, appMidl.checkAppCodeParam], actionController.getAction);

module.exports = router;
