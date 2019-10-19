const Joi = require('@hapi/joi');

const User = Joi.object({
  id: Joi.number().min(1),
  displayName: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  roleId: Joi.number().required(),
  creationDate: Joi.date(),
  companyId: Joi.number().required(),
  phoneNumber: Joi.string(),
  disabled: Joi.boolean().default(false),
  deleted: Joi.boolean().default(false),
});

module.exports = User;
