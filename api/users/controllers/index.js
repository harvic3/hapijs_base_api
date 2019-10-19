const Hoek = require('hoek');
const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const UserModel = require('../models');
const { Result, flowResult } = require('../../../utils/result');

class UserController extends Controller {
  constructor(request) {
    super(request);
    const firebaseContext =
      request.server.registrations.firebase.options.firebaseAdminContext;
    Hoek.assert(firebaseContext != null, Boom.badGateway());
    this.firebaseContext = firebaseContext;
    UserModel.init(this.instancePgDb());
  }

  validateCompanyActionRule(credentials, companyId) {
    if (credentials.companyId != companyId && !credentials.root) {
      throw Boom.unauthorized('No tiene permisos para ejecutar esta acción.');
    }
  }

  validateRoleRule(credentials, roleId) {
    if (roleId === 1 && !credentials.root) {
      throw Boom.unauthorized(
        'No tiene permisos para crear/editar un usuario con este rol.'
      );
    }
  }

  validateDataRoleRule(credentials, roles) {
    if (!credentials.root) {
      return roles.shift();
    }
  }

  buildClaims(user, roles) {
    let claims;
    const role = roles.filter(roleObj => {
      return roleObj.id === user.roleId;
    });
    if (role && role.length == 1) {
      claims = {
        companyId: user.companyId,
        roleId: user.roleId,
        [role[0].name.toString().trim()]: true,
        role: role[0].name.toString().trim(),
      };
    }
    return claims;
  }

  async addCustomClaims(uid, claims) {
    return await this.firebaseContext.auth().setCustomUserClaims(uid, claims);
  }

  async getUserFromFirebase(uid) {
    return await this.firebaseContext
      .auth()
      .getUser(uid)
      .catch(err => {
        throw Boom.badRequest(`${err.message} code error: ${err.code}`);
      });
  }

  async getUser(uid) {
    const result = new Result();
    try {
      result.data = await UserModel.getUser(uid);
      result.flow = flowResult.success;
    } catch (error) {
      result.flow = flowResult.failed;
      result.message = error.message;
      throw Boom.badRequest(result);
    }
    return h.response(result).code(flowResult.code);
  }

  async createUser(user) {
    const result = new Result();
    try {
      this.validateCompanyActionRule(
        this.request.auth.credentials,
        user.companyId
      );
      this.validateRoleRule(this.request.auth.credentials, user.roleId);
      const roles = await this.getRoles();
      delete user.id;
      const createdUser = await this.firebaseContext.auth().createUser(user);
      user.uid = createdUser.uid;
      delete user.password;
      result.data = await UserModel.createUser(user);
      const claims = this.buildClaims(user, roles.data);
      await this.addCustomClaims(user.uid, claims);
      result.flow = flowResult.success;
      result.message = 'The user was created';
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async updateUser(uid, user) {
    const result = new Result();
    try {
      this.validateCompanyActionRule(
        this.request.auth.credentials,
        user.companyId
      );
      this.validateRoleRule(this.request.auth.credentials, user.roleId);
      const roles = await this.getRoles();
      const claims = this.buildClaims(user, roles.data);
      await this.addCustomClaims(user.uid, claims);
      if (!user.password) {
        delete user.password;
      }
      await this.firebaseContext.auth().updateUser(uid, user);
      delete user.password;
      result.data = await UserModel.updateUser(uid, user);
      result.flow = flowResult.success;
      result.message = 'The user was updated';
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getUsers() {
    const result = new Result();
    try {
      result.data = await UserModel.getUsers();
      result.flow = flowResult.success;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getUsersByCompanyId(companyId) {
    const result = new Result();
    try {
      this.validateCompanyActionRule(this.request.auth.credentials, companyId);
      result.data = await UserModel.getUsersByCompanyId(companyId);
      result.flow = flowResult.success;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getRoles() {
    const result = new Result();
    try {
      const roles = await UserModel.getRoles();
      this.validateDataRoleRule(this.request.auth.credentials, roles);
      result.data = roles;
      result.flow = flowResult.success;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = UserController;
