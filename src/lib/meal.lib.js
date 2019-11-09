const models = require('../models');
const moment = require('moment');
const repository = require('./repository');

exports.syncMealData = async () => {
  console.log('Sync School Meal Data');
  const monthFromYMD = moment().startOf('month').format('YYYYMMDD');
  const monthToYMD = moment().endOf('month').format('YYYYMMDD');

  // const nextMonthFromYMD = moment().add(1, 'month').startOf('month').format('YYYYMMDD');
  // const nextMonthToYMD = moment().add(1, 'month').endOf('month').format('YYYYMMDD');

  try {
    // 대구소프트웨어 고등학교
    const { data: thisMonthMeal } = await repository.neisMealData(monthFromYMD, monthToYMD);

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
