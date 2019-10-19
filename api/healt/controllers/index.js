//const mongoose = require('mongoose');
const Controller = require('../../../utils/controller');
const config = require('../../../config/config');
const { Result, flowResult } = require('../../../utils/result');

class statusController extends Controller {
  async getStatus() {
    const result = new Result();
    try {
      const db = await this.instancePgDb();
      const query = await db('Parameters');
      result.data = {
        module: config.project.name,
        api: 'online',
        pg_db: !!(query && query.length >= 0) ? 'online' : 'offline',
        // db: mongoose.connection.readyState === 1,
      };
      result.flow = flowResult.success;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = statusController;
