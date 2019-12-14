const moment = require('moment');
const models = require('../models');
const ApiRepository = require('../request/apiRepository');

exports.syncMealData = async (schoolCode, searchDate) => {
  console.log('Sync School Meal Data');
  const dateYMD = moment(searchDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();

  try {
    let result;
    const { data: mealData } = await ApiRepository.neisMealData(schoolCode, dateYMD, dateYMD);
    
    if (!mealData.mealServiceDietInfo) {
      result = {
        saved: false,
        message: '급식이 없습니다',
      };
    } else {
      let meals = mealData.mealServiceDietInfo[1].row;

      if (Array.isArray(meals) === true) {
        meals = meals.map(meal => ({
          schoolName: meal.SCHUL_NM,
          schoolCode: meal.ATPT_OFCDC_SC_CODE,
          menu: meal.DDISH_NM.split('<br/>').join('\n'),
          mealTime: meal.MMEAL_SC_NM,
          mealDate: moment(meal.MLSV_FROM_YMD, 'YYYYMMDD').toString(),
        }));

        await models.Meal.bulkCreateMeal(meals);
        
        result = {
          saved: true,
          message: '급식을 저장하였습니다',
        };
      } else {
        result = {
          saved: false,
          message: '급식이 없습니다',
        };
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};
