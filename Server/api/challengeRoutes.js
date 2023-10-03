const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const challMidl = require('../middlewares/challengeMiddleware');
const appMidl = require('../middlewares/applicationMiddleware');
const authMidl = require('../middlewares/authMiddleware');

router.get('/:app_code/challenges', [authMidl.verifyToken], challengeController.getChallenges);
router.post('/:app_code/challenges', [authMidl.verifyToken, appMidl.checkOwner, challMidl.checkBody], challengeController.postChallenge);
router.get('/:app_code/challenges/requisites', [authMidl.verifyToken, appMidl.checkOwner], challengeController.getChallengesRequisites);
router.put('/:app_code/challenges/:challenge_code', [authMidl.verifyToken, appMidl.checkOwner, challMidl.checkChallenge, challMidl.checkCode], challengeController.updateChallenge);
router.delete('/:app_code/challenges/:challenge_code', [authMidl.verifyToken,appMidl.checkOwner, challMidl.checkChallenge], challengeController.deleteChallenge);
router.get('/:app_code/challenges/:actionPlayer_id', [authMidl.verifyToken], challengeController.getChallenge);

module.exports = router;
