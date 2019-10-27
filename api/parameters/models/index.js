const db = require('../../../repository/dbRepository');

const getDbContext = () => {
  return db.getDbInstance({});
};

const getParameterByName = async paramName => {
  const dbContext = getDbContext();
  var result = await dbContext('Parameters')
    .where('name', paramName)
    .first();
  return result || null;
};

module.exports = {
  getParameterByName,
};
