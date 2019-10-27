const Controller = require('../controller');

module.exports = {
  method: 'GET',
  path: '/healt',
  async handler(req, h) {
    const controller = await new Controller(req);
    return controller.getStatus();
  },
  options: {
    description: 'Monitorea el estado del servicio',
  },
};
