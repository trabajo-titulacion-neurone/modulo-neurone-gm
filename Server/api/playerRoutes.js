const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const imageStorage = require('../middlewares/imageStorage');
const authMidl = require('../middlewares/authMiddleware');
const playerMidl = require('../middlewares/playerMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');

router.get('/:app_code/players',  [authMidl.verifyToken], playerController.getPlayers);
router.post('/:app_code/players', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), playerMidl.checkCreate], playerController.postPlayer);
router.put('/:app_code/players/:player_code', [authMidl.verifyToken, appMidl.checkOwner, imageStorage.upload.single('file'), playerMidl.checkPlayer,  playerMidl.checkCode], playerController.updatePlayer);
router.delete('/:app_code/players/:player_code', [authMidl.verifyToken, appMidl.checkOwner], playerController.deletePlayer);
router.get('/:app_code/players/:player_code', [authMidl.verifyToken], playerController.getPlayer);
router.get('/:app_code/players/:player_code/completed-challenges', [authMidl.verifyToken], playerController.getPlayerCompletedChallenges);
router.get('/:app_code/players/:player_code/player-points', [authMidl.verifyToken],  playerController.getPlayerPoints);
router.get('/:app_code/players/:player_code/badges', [authMidl.verifyToken], playerController.getPlayerBadges);
router.get('/:app_code/players/:player_code/player-levels', [authMidl.verifyToken], playerController.getPlayerLevels);
router.get('/:app_code/players/:player_code/level-progress',  [authMidl.verifyToken], playerController.getPlayerLevelProgress);
router.get('/:app_code/players/by-group/:group_code', [authMidl.verifyToken], playerController.getPlayersByGroup);

module.exports = router;
