const express = require('express');
const router = express.Router();
const actionPlayerController = require('../controllers/actionPlayerController');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/players/:player_code/actions', [authMidl.verifyToken, appMidl.checkOwner], actionPlayerController.getActionsPlayer);
router.post('/:app_code/players/:player_code/actions', [authMidl.verifyToken, appMidl.checkOwner], actionPlayerController.postActionPlayer);

module.exports = router;
