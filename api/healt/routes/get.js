const Controller = require('../controllers');
const { Result, flowResult } = require('../../../utils/result');

module.exports = {
  method: 'GET',
  path: '/healt',
  async handler(req, h) {
    const controller = await new Controller(req);
    return controller.getStatus();
  },
  options: {
    description: 'Check the api state',
  },
};
