'use strict';

class Controller {
  constructor(request) {
    this.request = request;
    this.flowResult = {
      success: 'success',
      failed: 'failed',
      skipped: 'skipped',
    };
  }

  result() {
    return {
      data: null,
      message: null,
      flow: this.flowResult.success,
      statusCode: 200,
      error: null,
    };
  }
}

module.exports = Controller;
