const express = require('express');

const router = express.Router();

const { helloController } = require('../controller');

router.get('/', helloController.info.get);

module.exports = router;
