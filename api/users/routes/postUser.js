const Joi = require('@hapi/joi');
const Controller = require('../controller');

module.exports = {
  method: 'POST',
  path: '/users',
  async handler(req, h) {
    const controller = await new Controller(req);
    return await controller.createUser(req.payload);
  },
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email({
          minDomainSegments: 2,
        }),
        displayName: Joi.string().required(),
        password: Joi.string()
          .min(7)
          .required(),
        roleId: Joi.number().required(),
        companyId: Joi.number().required(),
        phoneNumber: Joi.string()
          .min(12)
          .required(),
        disabled: Joi.bool().default(false),
        deleted: Joi.bool().default(false),
      }).options({ allowUnknown: false }),
    },
    auth: {
      strategy: 'firebase',
      scope: ['root', 'admin'],
    },
    description: 'Crear usuario',
  },
};
