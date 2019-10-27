const Joi = require('@hapi/joi');
const Controller = require('../controller');

module.exports = {
  method: 'PUT',
  path: '/users/{uid}',
  async handler(req, h) {
    const controller = await new Controller(req);
    return controller.updateUser(req.params.uid, req.payload);
  },
  options: {
    validate: {
      params: {
        uid: Joi.string().required(),
      },
      payload: Joi.object({
        id: Joi.number().required(),
        uid: Joi.string().required(),
        email: Joi.string().email({
          minDomainSegments: 2,
        }),
        displayName: Joi.string().required(),
        roleId: Joi.number().required(),
        password: Joi.string()
          .optional()
          .min(7)
          .allow(null),
        creationDate: Joi.date(),
        companyId: Joi.number().required(),
        phoneNumber: Joi.string()
          .min(12)
          .required(),
        disabled: Joi.bool().required(),
        deleted: Joi.bool().required(),
      }).options({ allowUnknown: false }),
    },
    auth: {
      strategy: 'firebase',
      scope: ['root', 'admin'],
    },
    description: 'Actualiza un usuario',
  },
};
