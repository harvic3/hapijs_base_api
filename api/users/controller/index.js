const Hoek = require('hoek');
const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const UserModel = require('../models');

class UserController extends Controller {
  constructor(request) {
    super(request);
    const firebaseContext =
      request.server.registrations.firebase.options.firebaseAdminContext;
    Hoek.assert(firebaseContext != null, Boom.badGateway());
    this.firebaseContext = firebaseContext;
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
    return await this.firebaseContext.auth().getUser(uid);
  }

  async getUsers() {
    const result = this.result();
    try {
      result.data = await UserModel.getUsers();
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getUser(uid) {
    const result = this.result();
    try {
      result.data = await UserModel.getUser(uid);
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async createUser(user) {
    const result = this.result();
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
      result.message = 'El usuario fue creado.';
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async updateUser(uid, user) {
    const result = this.result();
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
      result.message = 'El usuario fue actualizado.';
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getUsersByCompanyId(companyId) {
    const result = this.result();
    try {
      this.validateCompanyActionRule(this.request.auth.credentials, companyId);
      result.data = await UserModel.getUsersByCompanyId(companyId);
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }

  async getRoles() {
    const result = this.result();
    try {
      const roles = await UserModel.getRoles();
      this.validateDataRoleRule(this.request.auth.credentials, roles);
      result.data = roles;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = UserController;
