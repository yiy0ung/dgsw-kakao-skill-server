const models = require('../models');
const moment = require('moment');
const momentTime = require('moment-timezone');
const repository = require('../request/repository');

exports.syncMealData = async (schoolCode) => {
  console.log('Sync School Meal Data');
  const monthFromYMD = momentTime.tz('Asia/Seoul').startOf('month').format('YYYYMMDD');
  const monthToYMD = momentTime.tz('Asia/Seoul').endOf('month').format('YYYYMMDD');

  try {
    const { data: thisMonthMeal } = await repository.neisMealData(schoolCode, monthFromYMD, monthToYMD);

    let meals = thisMonthMeal.mealServiceDietInfo[1].row;

    if (Array.isArray(meals) === true) {
      meals = meals.map(meal => ({
        schoolName: meal.SCHUL_NM,
        schoolCode: meal.ATPT_OFCDC_SC_CODE,
        menu: meal.DDISH_NM.split('<br/>').join('\n'),
        mealTime: meal.MMEAL_SC_NM,
        mealDate: moment(meal.MLSV_FROM_YMD, 'YYYYMMDD').toString(),
      }));
    } else {
      return;
    }

    await models.Meal.bulkCreateMeal(meals);

    return;
  } catch (error) {
    throw error;
  }
};
