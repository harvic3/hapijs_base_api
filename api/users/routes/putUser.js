const Joi = require('@hapi/joi');
const Controller = require('../controllers');

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
        disabled: Joi.bool().default(false),
        deleted: Joi.bool().default(false),
      }).options({ allowUnknown: true }),
    },
    auth: {
      strategy: 'firebase',
      scope: ['root', 'admin'],
    },
    description: 'Update a user',
  },
};
