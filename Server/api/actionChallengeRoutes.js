const express = require('express');
const router = express.Router();
const actionChallengeController = require('../controllers/actionChallengeController');

const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/challengesactions', [authMidl.verifyToken, appMidl.checkOwner] , actionChallengeController.getActionsChallenges);

module.exports = router;
