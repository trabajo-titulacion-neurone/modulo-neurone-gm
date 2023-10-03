const express = require('express');
const router = express.Router();

const pointPlayerController = require('../controllers/pointPlayerController');

router.post('/:app_code/players/:player_code/give-points', pointPlayerController.givePoints);

module.exports = router;
