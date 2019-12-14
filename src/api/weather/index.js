const router = require('express').Router();
const weatherCtrl = require('./weather.ctrl');

router.route('/kakao').post(weatherCtrl.getChatWeather);

module.exports = router;
