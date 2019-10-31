const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const config = require('../../../config/config');
const db = require('../../../repository/dbRepository');

const getDbContext = () => {
  return db.getDbInstance({});
};

class StatusController extends Controller {
  async getStatus() {
    const result = this.result();
    try {
      const dbContext = getDbContext();
      const query = await dbContext('Parameters');
      result.data = {
        module: config.project.name,
        api: 'online',
        pg_db: !!(query && query.length >= 0) ? 'online' : 'offline',
      };
    } catch (error) {
      return Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = StatusController;
