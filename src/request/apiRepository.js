const axios = require('axios');
const { neis, openWeatherMap } = require('../../config/keys.json');

exports.neisMealData = (schoolCode, fromYMD, toYMD) => {
  try {
    return axios.get('https://open.neis.go.kr/hub/mealServiceDietInfo', {
      params: {
        KEY: neis,
        Type: 'json',
        pSize: 200,
        ATPT_OFCDC_SC_CODE: schoolCode,
        SD_SCHUL_CODE: '7240393',
        MLSV_FROM_YMD: fromYMD,
        MLSV_TO_YMD: toYMD,
      },
    });
  } catch (error) {
    throw error;
  }
};

// default location : 그리니치 천문대
exports.weatherData = (latitude = 51.47, longitude = 0) => {
  try {
    return axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        APPID: openWeatherMap,
      },
    });
  } catch (error) {
    throw error;
  }
}
