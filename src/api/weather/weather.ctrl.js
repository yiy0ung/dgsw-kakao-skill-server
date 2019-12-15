const moment = require('moment-timezone');
const models = require('../../models');
const MealLib = require('../../lib/meal.lib');
const WeatherLib = require('../../lib/weather.lib');
const KakaoLib = require('../../lib/kakao.lib');

exports.getChatWeather = async (req, res) => {
  const { schoolcode: schoolCode } = req.query;

  try {
    // 학교 검사
    const schoolInfo = await MealLib.getSchoolInfo(schoolCode);
    
    if (schoolInfo.saved === false) {
      console.log('잘못된 학교 코드');
      const result = KakaoLib.SimpleText('잘못된 요청입니다\n다시 시도해주세요');
  
      res.status(400).json(result);
      return;
    }

    let todayWeather = await models.Weather.getTodayWeather(schoolCode);
    
    if (todayWeather !== undefined) {
      // 업데이트가 가능한지 확인
      const isLastWeather = moment.tz(todayWeather.createDate, 'Asia/Seoul').diff(moment.tz('Asia/Seoul').subtract(30, 'minute'));

      if (isLastWeather <= 0)  {
        // 날씨 불러오기
        await WeatherLib.syncWeather(schoolCode);
        todayWeather = await models.Weather.getTodayWeather(schoolCode);
      }
    } else {
      await WeatherLib.syncWeather(schoolCode);
      todayWeather = await models.Weather.getTodayWeather(schoolCode);
    }

    const weatherScript = WeatherLib.weatherCases(todayWeather.condition);
    // 내용
    const description = `온도 : ${todayWeather.temp}°C\n`
      + `습도 : ${todayWeather.humidity}%\n\n${weatherScript.subtitle}\n\n`;
      + `최신업데이트: ${moment.tz(todayWeather.createDate, 'Asia/Seoul').format('M월 D일 / h:m A')}\n`
      + '(30분간격으로 업데이트 가능 합니다)';
    
    const result = KakaoLib.BasicCard(
      weatherScript.title,
      description,
      weatherScript.imageUrl);

    res.status(200).json(result);
  } catch (error) {
    console.error(`날씨 조회 실패 : ${error}`);
    console.error(error);
    const result = KakaoLib.SimpleText('날씨를 알 수 없습니다\n잠시후에 다시 시도해주세요..ㅠㅠ');

    res.status(500).json(result);
  }
};
