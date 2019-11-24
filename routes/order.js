const passport = require('passport');
const express = require('express');
const controller = require('../controllers/c_order');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create);

module.exports = router;
