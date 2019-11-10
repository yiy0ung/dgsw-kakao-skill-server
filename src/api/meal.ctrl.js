const router = require('express').Router();
const models = require('../models');
const lib = require('../lib/meal.lib');
const kakao = require('../lib/kakao.lib');

router.post('/', async (req, res) => {
  console.log('급식 조회');
  const {
    type, // today, next
    schoolcode: schoolCode,
  } = req.query;

  if (!type || !schoolCode) {
    const result = kakao.SimpleText('급식 조회를 실패했어요');

    res.status(400).json(result);
    return;
  }

  try {
    const exist = await models.Meal.existThisMonthMeal(schoolCode);

    // 급식 sync
    if (Array.isArray(exist) && exist.length <= 0) {
      await lib.syncMealData(schoolCode);
    }

    let mealData; // 급식 정보

    if (type === 'today') {
      mealData = await models.Meal.getTodayByKakao(schoolCode);
    } else if (type === 'next') {
      mealData = await models.Meal.getNextByKakao(schoolCode);
    } else {
      const result = kakao.SimpleText('급식 조회를 실패했어요');

      res.status(400).json(result);
      return;
    }

    let result; // response

    if (mealData.length <= 0) {
      result = kakao.SimpleText('급식이 없어용..ㅜㅜ');
    } else {
      result = kakao.CarouselMeal(mealData);
    }

    res.status(200).json(result);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    const result = kakao.SimpleText('급식 조회를 실패했어요\n잠시후에 시도 해주세요.. ㅜㅜ');

    res.status(500).json(result);
  }
});

module.exports = router;
