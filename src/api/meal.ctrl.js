const router = require('express').Router();
const models = require('../models');
const lib = require('../lib/meal.lib');

async function getMealInfo(type, schoolCode) {
  let data = [];

  if (type === 'today') {
    data = await models.Meal.getTodayMeal(schoolCode);
  } else if (type === 'week') {
    data = await models.Meal.getWeekMeal(schoolCode);
  }

  return data;
}

router.get('/', async (req, res) => {
  let { type, schoolCode } = req.query; // type: today, week

  console.log(`급식 조회 ${type}`);

  if (!type) {
    type = 'today';
  }

  if (!schoolCode) {
    result = {
      status: 400,
      message: 'required school code',
    };

    res.status(400).json(result);
    return
  }

  try {
    const mealData = await models.Meal.getMonthMeal(schoolCode);

    if (Array.isArray(mealData) && mealData.length <= 0) {
      await lib.syncMealData();
    }

    let mealInfo = await getMealInfo(type, schoolCode);

    const result = {
      status: 200,
      message: '급식 조회 성공',
      data: {
        meal: mealInfo,
      },
    };

    res.status(200).json(result);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    console.error(error);

    const result = {
      status: 500,
      message: '조회를 실패했습니다',
    };

    res.status(500).json(result);
  }
});

module.exports = router;
