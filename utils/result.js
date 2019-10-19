'use strict';

const flowResult = {
  success: 'success',
  failed: 'failed',
  skipped: 'skipped',
};

class Result {
  constructor() {
    this.data = null;
    this.message = null;
    this.flow = flowResult.failed;
    this.statusCode = 200;
    this.error = null;
  }
}

module.exports = {
  flowResult,
  Result,
};
