const moment = require('moment');
const models = require('../models');
const ApiRepository = require('../request/apiRepository');

exports.getSchoolInfo = async (schoolCode) => {
  console.log('Find School Information');

  try {
    let result;
    const { data: schoolData } = await ApiRepository.neisSchoolInfo(schoolCode);

    if (!schoolData.schoolInfo) {
      result = {
        saved: false,
        message: '학교정보가 없습니다'
      };
    } else if (
        Array.isArray(schoolData.schoolInfo[1].row) 
        && schoolData.schoolInfo[1].row.length <= 0
      ) {
      result = {
        saved: false,
        message: '학교정보가 없습니다'
      };
    } else {
      const school = schoolData.schoolInfo[1].row[0];
      result = {
        saved: true,
        message: '학교정보를 찾았습니다',
        data: {
          educationCode: school.ATPT_OFCDC_SC_CODE,
          educationName: school.ATPT_OFCDC_SC_NM,
          schoolCode: school.SD_SCHUL_CODE,
          schoolName: school.SCHUL_NM,
          location: school.ORG_RDNMA,
          phoneNumber: school.ORG_TELNO,
          homepage: school.HMPG_ADRES,
        },
      };
    }

    return result;
  } catch (error) {
    throw error;
  }
};

exports.syncMealData = async (educationCode, schoolCode, searchDate) => {
  console.log('Sync School Meal Data');

  try {
    let result;
    const dateYMD = moment(searchDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
    const { data: mealData } = await ApiRepository.neisMealData(educationCode, schoolCode, dateYMD, dateYMD);
    
    if (!mealData.mealServiceDietInfo) {
      result = {
        saved: false,
        message: '급식이 없습니다',
      };
    } else {
      let meals = mealData.mealServiceDietInfo[1].row;

      if (Array.isArray(meals) === true) {
        meals = meals.map(meal => ({
          educationCode: meal.ATPT_OFCDC_SC_CODE,
          schoolName: meal.SCHUL_NM,
          schoolCode: meal.SD_SCHUL_CODE,
          menu: meal.DDISH_NM.split('<br/>').join('\n'),
          mealTime: meal.MMEAL_SC_NM,
          mealDate: moment(meal.MLSV_FROM_YMD, 'YYYYMMDD').toString(),
        }));

        await models.Meal.bulkCreateMeal(meals);
        
        result = {
          saved: true,
          message: '급식을 저장하였습니다',
        };
      } else {
        result = {
          saved: false,
          message: '급식이 없습니다',
        };
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};
