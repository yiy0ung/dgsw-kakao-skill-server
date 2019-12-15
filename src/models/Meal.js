const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    educationCode: {
      field: 'education_code',
      type: DataTypes.STRING(30),
      allowNull: false,
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
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'meal',
    timestamps: false,
  });

  const attributes = 'school_name AS schoolName, school_code AS schoolode, menu, meal_time AS mealTime, meal_date AS mealDate';
  const attributesByKakao = 'meal_time AS title, menu AS description';

  Meal.searchMeal = (schoolCode, searchDate) => sequelize.query(`
    SELECT ${attributes}
    FROM meal
    WHERE school_code = :schoolCode AND :searchDate = date_format(meal_date, "%Y-%c-%d");
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      schoolCode,
      searchDate,
    },
    raw: true,
  });

  Meal.searchMealByKakao = (schoolCode, searchDate) => sequelize.query(`
    SELECT ${attributesByKakao}
    FROM meal
    WHERE school_code = :schoolCode AND :searchDate = date_format(meal_date, "%Y-%c-%d");
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      schoolCode,
      searchDate,
    },
    raw: true,
  });

  Meal.createMeal = (data) => Meal.create(data);

  Meal.bulkCreateMeal = (data) => Meal.bulkCreate(data);

  return Meal;
}