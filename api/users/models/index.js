const db = require('../../../repository/dbRepository');

const getDbContext = () => {
  return db.getDbInstance({});
};

const createUser = async user => {
  const dbContext = getDbContext();
  return dbContext('Users').insert(user, '*');
};

const updateUser = async (uid, userData) => {
  const dbContext = getDbContext();
  return dbContext('Users')
    .update(userData)
    .where('uid', uid);
};

const getUser = async uid => {
  const dbContext = getDbContext();
  return dbContext('Users')
    .where('uid', uid)
    .select('*')
    .first();
};

const getUsers = async () => {
  const dbContext = getDbContext();
  var result = await dbContext('Users')
    .select('*')
    .where('deleted', false);
  return result;
};

const getUsersByCompanyId = async companyId => {
  const dbContext = getDbContext();
  return dbContext('Users')
    .select('*')
    .where('companyId', companyId);
};

const getRoles = async () => {
  const dbContext = getDbContext();
  return dbContext('Roles').select('*');
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUsers,
  getUsersByCompanyId,
  getRoles,
};
