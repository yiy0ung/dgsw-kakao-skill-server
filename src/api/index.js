const router = require('express').Router();
const meal = require('./meal');
const weather = require('./weather.ctrl');

const permitMiddleware = require('../middleware/permission');

router.use('/meal', permitMiddleware, meal);
router.use('/weather', permitMiddleware, weather);

module.exports = router;
