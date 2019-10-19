const Hoek = require('hoek');
const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const ParamModel = require('../models');
const { Result, flowResult } = require('../../../utils/result');

class ParameterController extends Controller {
  constructor(request) {
    super(request);
    const firebaseContext =
      request.server.registrations.firebase.options.firebaseAdminContext;
    Hoek.assert(firebaseContext != null, Boom.badGateway());
    this.firebaseContext = firebaseContext;
    ParamModel.init(this.instancePgDb());
  }

  async getParameterByName(parameterName) {
    const result = new Result(200);
    try {
      result.data = await ParamModel.getParameterByName(parameterName);
      result.flow = flowResult.success;
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = ParameterController;
