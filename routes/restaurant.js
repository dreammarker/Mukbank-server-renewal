const express = require('express');

const router = express.Router();

const { restaurantController } = require('../controller');

router.post('/distance', restaurantController.restdistance.post);

module.exports = router;
