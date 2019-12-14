const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schoolName: {
      field: 'school_name',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    schoolCode: {
      field: 'school_code',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    menu: {
      field: 'menu',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    mealTime: { // 조식, 중식, 석식
      field: 'meal_time',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    mealDate: {
      field: 'meal_date',
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'meal',
    timestamps: false,
  });

  Meal.getTodayByKakao = (schoolCode) => sequelize.query(`
    SELECT meal_time AS title, menu AS description
    FROM meal
    WHERE school_code = :schoolCode AND meal_date = :today;
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      schoolCode,
      // today: moment().startOf('day').format('YYYY-MM-DD').toString(),
      today: moment.tz('Asia/Seoul').startOf('day').format('YYYY-MM-DD').toString(),
    },
    raw: true,
  });

  Meal.searchMealByKakao = (schoolCode, searchDate) => sequelize.query(`
    SELECT meal_time AS title, menu AS description
    FROM meal
    WHERE school_code = :schoolCode AND meal_date = :searchDate;
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      schoolCode,
      searchDate,
    },
    raw: true,
  });

  Meal.getNextByKakao = (schoolCode) => sequelize.query(`
    SELECT meal_time AS title, menu AS description
    FROM meal
    WHERE school_code = :schoolCode AND meal_date = :today;
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      schoolCode,
      today: moment.tz('Asia/Seoul').add(1, 'day').startOf('day').format('YYYY-MM-DD').toString(),
    },
    raw: true,
  });

  Meal.existMonthMeal = (schoolCode, searchDate) => Meal.findAll({
    attributes: [
      'idx',
      'schoolName',
      'schoolCode',
      'menu',
      'mealTime',
      [sequelize.fn('date_format', sequelize.col('meal_date'), '%Y년 %m월 %d일'), 'mealDate'],
    ],
    where: {
      schoolCode,
      mealDate: {
        between: [
          moment(searchDate).tz('Asia/Seoul').startOf('month').format('YYYY-MM-DD').toString(),
          moment(searchDate).tz('Asia/Seoul').endOf('month').format('YYYY-MM-DD').toString(),
        ],
      },
    },
    raw: true,
  });

  Meal.createMeal = (data) => Meal.create(data);

  Meal.bulkCreateMeal = (data) => Meal.bulkCreate(data);

  return Meal;
}