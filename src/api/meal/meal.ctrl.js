const moment = require('moment-timezone');
const models = require('../../models');
const Validate = require('../../lib/validation');
const MealLib = require('../../lib/meal.lib');
const KakaoLib = require('../../lib/kakao.lib');

/**
 * @method GET
 */
exports.getMeals = async (req, res) => {
  console.log('일반 급식 조회');

  try {
    await Validate.validationCheckDateFormat(req.query);
  } catch (error) {
    console.log(`요청 형식 오류 - 급식 조회 실패 : ${error}`);
    const result = {
      status: 400,
      message: '급식 조회 실패',
    };

    res.status(400).json(result);
    return;
  }

  try {
    const {
      schoolcode: schoolCode,
      date: searchDate,
    } = req.query;
    let mealData = await models.Meal.searchMeal(schoolCode, searchDate);

    // 급식 sync
    if (mealData.length <= 0) {
      const { saved } = await MealLib.syncMealData(schoolCode, searchDate);

      if (saved === true) {
        mealData = await models.Meal.searchMeal(schoolCode, searchDate);
      }
    }

    const result = {
      status: 200,
      message: '급식 조회 성공',
      data: mealData,
    };

    res.status(200).json(result);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`서버에러 - 급식 조회 실패 : ${error}`);
    const result = {
      status: 500,
      message: '급식 조회 실패',
    };

    res.status(500).json(result);
  }
};

/**
 * @method POST
 */
exports.getChatMealInfo = async (req, res) => {
  console.log("카카오 챗 급식 조회");
  const { body } = req;
  const {
    schoolcode: schoolCode,
    dateType, // 조회하고 싶은 날짜 today, tomorrow, custom
  } = req.query;

  try {
    let searchDate = ''; // 검색할 날짜

    if (dateType === 'today') {
      searchDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
    } else if (dateType === 'tomorrow') {
      searchDate = moment.tz('Asia/Seoul').add('day', 1).format('YYYY-MM-DD').toString();
    } else if (dateType === 'custom') {
      try {
        searchDate = KakaoLib.searchBodyParameter(body, 'searchDate');
      } catch (error) {
        const result = KakaoLib.SimpleText('잘못된 요청입니다\n다시 시도해주세요');
  
        res.status(400).json(result);
        return;
      }
    } else {
      const result = KakaoLib.SimpleText('잘못된 요청입니다\n다시 시도해주세요');

      res.status(400).json(result);
      return;
    }

    let reply; // response
    let syncMeal = true; // sync 여부 확인
    let mealData = await models.Meal.searchMealByKakao(schoolCode, searchDate);

    // 급식 sync
    if (mealData.length <= 0) {
      const { saved } = await MealLib.syncMealData(schoolCode, searchDate);

      if (saved === false) {
        syncMeal = saved;
      }

      mealData = await models.Meal.searchMealByKakao(schoolCode, searchDate);
    }

    // 카카오 format 설정
    if (syncMeal === true) { 
      reply = KakaoLib.CarouselMeal(mealData);
    } else {
      reply = KakaoLib.SimpleText('급식이 없어용..ㅜㅜ');
    }

    res.status(200).json(reply);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    const result = KakaoLib.SimpleText('잘못된 요청입니다\n다시 시도해주세요');

    res.status(500).json(result);
  }
};
