const router = require('express').Router();
const moment = require('moment-timezone');
const models = require('../models');
const weather = require('../lib/weather.lib');
const kakao = require('../lib/kakao.lib');

router.post('/', async (req, res) => {
  const { schoolcode: schoolCode } = req.query;

  try {
    let todayWeather = await models.Weather.getTodayWeather();
    const isLastWeather = moment.tz(todayWeather.createDate, 'Asia/Seoul').toString() <= moment.tz('Asia/Seoul').subtract(1, 'hour').toString();

    if (!todayWeather || isLastWeather)  {
      // 날씨 불러오기
      await weather.syncWeather(schoolCode);
      todayWeather = await models.Weather.getTodayWeather();
    }

    const weatherScript = weather.weatherCases[todayWeather.condition];

    const result = kakao.BasicCard(
      weatherScript.title,
      `온도 : ${todayWeather.temp}°C\n체감온도 : ${todayWeather.windChill}°C\n습도 : ${todayWeather.humidity}%\n\n${weatherScript.subtitle}`,
      weatherScript.imageUrl);

    res.status(200).json(result);
  } catch (error) {
    console.error(`날씨 조회 실패 : ${error}`);
    console.error(error);
    const result = kakao.SimpleText('날씨를 알 수 없습니다\n잠시후에 다시 시도해주세요..ㅠㅠ');

    res.status(500).json(result);
  }
});

module.exports = router;
