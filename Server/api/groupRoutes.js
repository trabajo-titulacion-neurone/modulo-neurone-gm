const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const groupMidl = require('../middlewares/groupMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/groups', [authMidl.verifyToken, appMidl.checkAppCodeParam],  groupController.getGroups);
router.post('/:app_code/groups', [authMidl.verifyToken, appMidl.checkOwner, groupMidl.checkCreate], groupController.postGroup);
router.put('/:app_code/groups/:group_code', [authMidl.verifyToken, appMidl.checkOwner, groupMidl.checkGroup,  groupMidl.checkCode] , groupController.updateGroup);
router.delete('/:app_code/groups/:group_code', [authMidl.verifyToken,  appMidl.checkOwner, groupMidl.checkGroup], groupController.deleteGroup);
router.get('/:app_code/groups/:group_code', [authMidl.verifyToken, appMidl.checkAppCodeParam], groupController.getGroup);

module.exports = router;
