//const mongoose = require('mongoose');
const Controller = require('../../../utils/controller');
const config = require('../../../config/config');
const { Result, flowResult } = require('../../../utils/result');
const db = require('../../../repository/dbRepository');

const getDbContext = () => {
  return db.getDbInstance({});
};

class statusController extends Controller {
  async getStatus() {
    const result = new Result();
    try {
      const dbContext = getDbContext();
      const query = await dbContext('Parameters');
      result.data = {
        module: config.project.name,
        api: 'online',
        pg_db: !!(query && query.length >= 0) ? 'online' : 'offline',
        // db: mongoose.connection.readyState === 1,
      };
      result.flow = flowResult.success;
    } catch (error) {
      return Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = statusController;
