const Joi = require('@hapi/joi');
const Controller = require('../controller');

module.exports = [
  {
    method: 'GET',
    path: '/users',
    async handler(req, h) {
      const controller = await new Controller(req);
      return controller.getUsers();
    },
    options: {
      auth: {
        strategy: 'firebase',
        scope: 'root',
      },
      description: 'Obtener todos los usuarios',
    },
  },
  {
    method: 'GET',
    path: '/users/{uid}',
    async handler(req, h) {
      const controller = await new Controller(req);
      return controller.getUser(req.params.uid);
    },
    options: {
      validate: {
        params: {
          uid: Joi.string().required(),
        },
      },
      auth: {
        strategy: 'firebase',
        scope: ['root', 'admin', 'operator'],
      },
      description: 'Obtener un usuario',
    },
  },
  {
    method: 'GET',
    path: '/users/company/{companyId}',
    async handler(req, h) {
      const controller = await new Controller(req);
      return controller.getUsersByCompanyId(req.params.companyId);
    },
    options: {
      validate: {
        params: {
          companyId: Joi.number().required(),
        },
      },
      auth: {
        strategy: 'firebase',
        scope: ['root', 'admin'],
      },
      description: 'Obtener todos los usuarios de una compañía',
    },
  },
  {
    method: 'GET',
    path: '/users/roles',
    async handler(req, h) {
      const controller = await new Controller(req);
      return controller.getRoles();
    },
    options: {
      auth: {
        strategy: 'firebase',
        scope: ['root', 'admin'],
      },
      description: 'Obtener todos los roles',
    },
  },
];
