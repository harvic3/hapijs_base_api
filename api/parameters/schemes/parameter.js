const Joi = require('@hapi/joi');

const Parameter = Joi.object({
  id: Joi.number().min(1),
  name: Joi.string().required(),
  value: Joi.string().required(),
});

module.exports = Parameter;
