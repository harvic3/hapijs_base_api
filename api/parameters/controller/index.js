const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const ParamModel = require('../models');

class ParameterController extends Controller {
  constructor(request) {
    super(request);
  }

  async getParameterByName(parameterName) {
    const result = this.result();
    try {
      result.data = await ParamModel.getParameterByName(parameterName);
    } catch (error) {
      throw Boom.badRequest(error.message);
    }
    return result;
  }
}

module.exports = ParameterController;
