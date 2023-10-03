const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');


router.get('/image/:filename', imageController.getOneImage);
router.get('/image', imageController.getImages);
 
module.exports = router;
