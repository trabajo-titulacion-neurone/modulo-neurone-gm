const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const authMidl = require('../middlewares/authMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');

router.get('/:app_code/webhooks', [authMidl.verifyToken, appMidl.checkOwner], webhookController.getWebhooks);
router.put('/:app_code/webhooks', [authMidl.verifyToken, appMidl.checkOwner], webhookController.updateWebhooks);

module.exports = router;