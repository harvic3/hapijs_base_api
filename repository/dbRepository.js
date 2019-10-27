'use strict';

const Knex = require('knex');
const Hoek = require('hoek');
const config = require('../config/config');

let postgres;

const DEFAULTS = {
  connection: config.project.postgresdb,
  attach: 'onPreHandler',
  detach: 'tail',
  searchPath: 'public',
  pool: {
    destroy: client => client.end(),
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    log: true,
  },
  debug: false,
  acquireConnectionTimeout: 10000,
};

const createPostgresInstanceDb = options => {
  const config = Hoek.applyToDefaults(DEFAULTS, options);
  const {
    connection,
    pool,
    searchPath,
    acquireConnectionTimeout,
    debug,
  } = config;

  Hoek.assert(
    connection !== undefined,
    new Error('PG connection is undefined')
  );

  this.postgres = Knex({
    client: 'pg',
    connection,
    pool,
    searchPath,
    acquireConnectionTimeout,
    debug,
  });
};

const getDbInstance = options => {
  if (!this.postgres) {
    createPostgresInstanceDb(options);
  }
  return this.postgres;
};

module.exports = {
  getDbInstance,
};
