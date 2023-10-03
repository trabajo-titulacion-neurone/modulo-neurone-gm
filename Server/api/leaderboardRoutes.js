const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');
const lbMidl = require('../middlewares/leaderboardMiddleware');

router.get('/:app_code/leaderboards', [authMidl.verifyToken, appMidl.checkAppCodeParam], leaderboardController.getLeaderboards);
router.post('/:app_code/leaderboards', [authMidl.verifyToken, appMidl.checkOwner], lbMidl.checkCreate, leaderboardController.postLeaderboard);
router.put('/:app_code/leaderboards/:leaderboard_code', [authMidl.verifyToken, appMidl.checkOwner, lbMidl.checkLeaderboard, lbMidl.checkCode], leaderboardController.updateLeaderboard);
router.delete('/:app_code/leaderboards/:leaderboard_code', [authMidl.verifyToken, appMidl.checkOwner, lbMidl.checkLeaderboard], leaderboardController.deleteLeaderboard);
router.get('/:app_code/leaderboards/:leaderboard_code', [authMidl.verifyToken], leaderboardController.getLeaderboard);
router.post('/:app_code/leaderboards/:leaderboard_code/generate', [authMidl.verifyToken, appMidl.checkAppCodeParam,lbMidl.checkLeaderboard ], leaderboardController.makeLeaderboard)

module.exports = router;
