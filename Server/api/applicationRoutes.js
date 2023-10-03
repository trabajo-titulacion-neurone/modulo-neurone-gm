const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMidl = require('../middlewares/authMiddleware');
const appMidl = require('../middlewares/applicationMiddleware')

router.get('/applications', [authMidl.verifyToken], applicationController.getApps);
router.get('/applications/:username/userApps', [authMidl.verifyToken], applicationController.getUserApps);
router.post('/applications', [authMidl.verifyToken, appMidl.checkCreate], applicationController.postApp);
router.put('/applications/:app_code', [authMidl.verifyToken, appMidl.checkOwner], applicationController.updateApp);
router.delete('/applications/:app_code', [authMidl.verifyToken,  appMidl.checkOwner], applicationController.deleteApp);
router.get('/applications/:app_code', [authMidl.verifyToken], applicationController.getApp);
router.get('/applications/:username/focus', [authMidl.verifyToken], applicationController.getFocusApp);
router.post('/applications/:username/changeActive', [authMidl.verifyToken], applicationController.changeFocusApp);
router.get('/applications/:app_code/summary', [authMidl.verifyToken], applicationController.appSummary);

module.exports = router;
