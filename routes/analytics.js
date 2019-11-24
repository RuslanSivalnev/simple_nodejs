const express = require('express');
const controller = require('../controllers/c_analytics');
const router = express.Router();

router.get('/overview', controller.overview);

router.get('/analytics', controller.analitics);

module.exports = router;
