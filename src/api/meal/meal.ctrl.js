const moment = require('moment-timezone');
const models = require('../../models');
const lib = require('../../lib/meal.lib');
const KakaoLib = require('../../lib/kakao.lib');

exports.getMeals = async (req, res) => {

};

/**
 * @method post
 */
exports.getChatMealInfo = async (req, res) => {
  console.log("object");
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
    let mealData = await models.Meal.searchMealByKakao(schoolCode, searchDate);

    // 급식 sync
    if (Array.isArray(mealData) && mealData.length <= 0) {
      const { saved } = await lib.syncMealData(schoolCode, searchDate);

      if (saved === true) {
        mealData = await models.Meal.searchMealByKakao(schoolCode, searchDate);
        reply = KakaoLib.CarouselMeal(mealData);
      } else {
        reply = KakaoLib.SimpleText('급식이 없어용..ㅜㅜ');
      }
    } else {
      reply = KakaoLib.CarouselMeal(mealData);
    }

    res.status(200).json(reply);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    const result = KakaoLib.SimpleText('잘못된 요청입니다\n다시 시도해주세요');

    res.status(500).json(result);
  }
};
