const router = require('express').Router();
const mealCtrl = require('./meal.ctrl');

router.route('/').get(mealCtrl.getMeals);
router.route('/kakao').post(mealCtrl.getChatMealInfo);

module.exports = router;
