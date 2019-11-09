const router = require('express').Router();
const models = require('../models');
const lib = require('../lib/meal.lib');
const kakao = require('../lib/kakao.lib');

router.post('/', async (req, res) => {
  console.log('오늘 급식 조회');
  const { schoolcode } = req.query;

  if (!schoolcode) {
    const result = kakao.SimpleText('급식 조회를 실패했어요');

    res.status(500).json(result);
    return;
  }

  try {
    const exist = await models.Meal.existThisMonthMeal(schoolcode);

    if (Array.isArray(exist) && exist.length <= 0) {
      await lib.syncMealData();
    }

    const todayMeal = await models.Meal.getTodayByKakao(schoolcode);

    const result = kakao.CarouselMeal(todayMeal);
    res.status(200).json(result);

    console.log('오늘 급식 조회 성공');
  } catch (error) {
    console.error(`오늘 급식 조회 실패 : ${error}`);
    const result = kakao.SimpleText('급식 조회를 실패했어요\n잠시후에 시도 해주세요.. ㅜㅜ');

    res.status(500).json(result);
  }
});

router.post('/week', async (req, res) => {
  console.log('일주일 급식 조회');
  const { schoolcode } = req.query;

  if (!schoolcode) {
    const result = kakao.SimpleText('급식 조회를 실패했어요');

    res.status(500).json(result);
    return;
  }

  try {
    const exist = await models.Meal.existThisMonthMeal(schoolcode);

    if (Array.isArray(exist) && exist.length <= 0) {
      await lib.syncMealData();
    }

    const todayMeal = await models.Meal.getTodayByKakao(schoolcode);

    const result = kakao.ListCard('일주일 급식', '', todayMeal);
    res.status(200).json(result);

    console.log('일주일 급식 조회 성공');
  } catch (error) {
    console.error(`일주일 급식 조회 실패 : ${error}`);
    const result = kakao.SimpleText('일주일 급식 조회를 실패했어요\n잠시후에 시도 해주세요.. ㅜㅜ');

    res.status(500).json(result); 
  }
});

router.post('/hello', (req, res) => {
  console.log('hahaha');

  const result = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
              text: '예제 텍스트입니다',
          },
        },
      ],
    },
  };

  res.status(200).json(result);
});

module.exports = router;
