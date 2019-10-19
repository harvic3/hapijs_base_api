'use strict';

const Knex = require('knex');
const Hoek = require('hoek');

let postgres;
const DEFAULTS = {
  connection: undefined,
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

module.exports = {
  name: 'knex_pg',
  version: '1.0.0',
  async register(server, options) {
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

    postgres = Knex({
      client: 'pg',
      connection,
      pool,
      searchPath,
      acquireConnectionTimeout,
      debug,
    });

    server.expose('pg_db', () => postgres);

    postgres('Parameters')
      .then(data => {
        console.log(`\x1b[33mPostgres status: \x1b[32m ✔ Active \x1b[0m`);
      })
      .catch(error => {
        console.log(`\x1b[33mPostgres status: \x1b[31m ✘ Error \x1b[0m`);
        console.log(`Postgres connection error: ${error.message}`);
      });

    // server.ext(config.attach, (request, reply) => {
    //   request.pg_db = postgres;
    //   reply.continue();
    // });

    // server.on(config.detach, (request, err) => {
    //   if (request.pg_db) {
    //     request.pg_db.destroy();
    //   }
    // });
  },
};
