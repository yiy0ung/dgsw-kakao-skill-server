const axios = require('axios');
const { apiKey } = require('../../config/neis.json');

exports.neisMealData = (fromYMD, toYMD) => {
  try {
    return axios.get('https://open.neis.go.kr/hub/mealServiceDietInfo', {
      params: {
        KEY: apiKey,
        Type: 'json',
        pSize: 200,
        ATPT_OFCDC_SC_CODE: 'D10',
        SD_SCHUL_CODE: '7240393',
        MLSV_FROM_YMD: fromYMD,
        MLSV_TO_YMD: toYMD,
      },
    });
  } catch (error) {
    throw error;
  }
};

