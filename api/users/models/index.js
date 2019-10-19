const UserSchema = require('../schemes/user');
let dbContext;

const init = pgDbContext => {
  pgDbContext.then(result => {
    this.dbContext = result;
  });
};

const createUser = async user => {
  return this.dbContext('Users').insert(user, '*');
};

const updateUser = async (uid, userData) => {
  return this.dbContext('Users')
    .update(userData)
    .where('uid', uid);
};

const getUser = async uid => {
  return this.dbContext('Users')
    .where('uid', uid)
    .select()
    .first();
};

const getUsers = async () => {
  var result = await this.dbContext
    .select('*')
    .from('Users')
    .where('deleted', false);
  return result;
};

const getUsersByCompanyId = async companyId => {
  return this.dbContext('Users')
    .select('*')
    .where('companyId', companyId);
};

const getRoles = async () => {
  return this.dbContext('Roles');
};

module.exports = {
  init,
  createUser,
  updateUser,
  getUser,
  getUsers,
  getUsersByCompanyId,
  getRoles,
};
