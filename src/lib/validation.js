const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validationCheckDateFormat = async (body) => {
  const schema = Joi.object().keys({
    date: Joi.date().format(['YYYY-MM-DD']).required(),
  }).required();

  try {
    return await schema.validate(body);
  } catch (error) {
    throw error;
  }
};
