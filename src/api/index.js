const router = require('express').Router();
const meal = require('./meal.ctrl');
const permitMiddleware = require('../middleware/permission');

router.use('/meal', meal);

module.exports = router;
