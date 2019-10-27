//const mongoose = require('mongoose');

class Controller {
  constructor(request) {
    this.request = request;
  }
  // async instancePgDb() {
  //   return this.request.server.plugins.knex_pg.pg_db();
  // }

  // ObjectId() {
  // 	return mongoose.Types.ObjectId;
  // }
}

module.exports = Controller;
