const ParamSchema = require('../schemes/parameter');
let dbContext;

const init = pgDbContext => {
  pgDbContext.then(result => {
    this.dbContext = result;
  });
};

const getParameterByName = async paramName => {
  var result = await this.dbContext('Parameters')
    .where('name', paramName)
    .first();
  return result || null;
};

module.exports = {
  init,
  getParameterByName,
};
