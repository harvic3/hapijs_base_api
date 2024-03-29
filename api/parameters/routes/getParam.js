const Joi = require('@hapi/joi');
const Controller = require('../controller');

module.exports = {
  method: 'GET',
  path: '/parameters/{name}',
  async handler(req, h) {
    const controller = await new Controller(req);
    return controller.getParameterByName(req.params.name);
  },
  options: {
    validate: {
      params: {
        name: Joi.string().required(),
      },
    },
    auth: {
      strategy: 'firebase',
      scope: 'root',
    },
    description: 'Obtener los parámetros',
  },
};
