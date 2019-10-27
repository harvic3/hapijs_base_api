const Boom = require('@hapi/boom');
const Controller = require('../../../utils/controller');
const ParamModel = require('../models');
const { Result, flowResult } = require('../../../utils/result');

class ParameterController extends Controller {
  constructor(request) {
    super(request);
  }

  async getParameterByName(parameterName) {
    const result = new Result();
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
