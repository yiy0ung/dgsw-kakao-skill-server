require('dotenv').config();

const models = require('../models');
const repository = require('../request/repository');
const location = require('../../config/location.json');
const env = require('../../config/env.json');

const ip = process.env.NODE_ENV === 'production' ? env.remoteIp : env.localIp;
const port = process.env.PORT;

exports.weatherCases = {
  Rain: {
      title: "비가내림",
      subtitle: "나가실 때 우산을 챙기세요!",
      imageUrl: `http://${ip}:${port}/static/weather/rain.png`,
  },
  Clear: {
      title: "맑음",
      subtitle: `화창한 날씨, 나가서 산책이라도 하시는게 어떠세요?`,
      imageUrl: `http://${ip}:${port}/static/weather/sunny.png`,
  },
  Thunderstorm: {
      title: "천둥 번개가 침",
      subtitle: "천둥 번개가 치니 야외활동을 자제해주세요",
      imageUrl: `http://${ip}:${port}/static/weather/flash.png`,
  },
  Clouds: {
      title: "구름많음",
      subtitle: "오늘은 기분이 안좋을 수 있어요",
      imageUrl: `http://${ip}:${port}/static/weather/wind.png`,
  },
  Snowing: {
      title: "눈이옴",
      subtitle: "펑펑 눈이 옵니다\n하늘에서 눈이 옵니다~",
      imageUrl: `http://${ip}:${port}/static/weather/snowflake.png`,
  },
  Drizzel: {
      title: "안개낌",
      subtitle: "안개가 자옥하니 안전에 유의하세요",
      imageUrl: `http://${ip}:${port}/static/weather/drop.png`,
  },
  Mist: {
      title: "안개낌",
      subtitle: "안개가 자옥하니 안전에 유의하세요",
      imageUrl: `http://${ip}:${port}/static/weather/drop.png`,
  },
  Haze: {
      title: "안개낌",
      subtitle: "안개가 자옥하니 안전에 유의하세요",
      imageUrl: `http://${ip}:${port}/static/weather/drop.png`,
  },
}

exports.syncWeather = async (schoolCode) => {
  console.log('Sync Weather Data');

  try {
    const schoolLocation = location[schoolCode];

    if (!schoolLocation || Object.entries(schoolLocation).length <= 0) {
      throw new Error('Can not find school location by School Code');
    }

    const { data } = await repository.weatherData(schoolLocation.latitude, schoolLocation.longitude);

    const temp = (data.main.temp-273.15).toFixed(1);
    const wind = data.wind.speed;
    const windChill = 13.12 + (0.6215*(temp)) - (11.37*Math.pow(wind, 0.16)) + (0.3965*Math.pow(wind, 0.16)*(temp))

    const weatherFormat = {
      condition: data.weather[0].main,
      temp,
      windChill: windChill.toFixed(1),
      humidity: data.main.humidity,
    }

    await models.Weather.createWeather(weatherFormat);
  } catch (error) {
    throw error;
  }
};
