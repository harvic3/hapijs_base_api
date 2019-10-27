const path = require('path');
const firebase = require('firebase-admin');
const HapiSentry = require('hapi-sentry');
const Sentry = require('@sentry/node');
const config = require('../config/config');
const Routes = require('./routes');
const firebaseAuth = require('./firebase-auth');
Sentry.init({ dsn: config.project.sentry });

const register = async server => {
  // await server.register({
  //   plugin: Mongoose,
  //   options: {
  //     uri: config.project.mongodb,
  //     config: {
  //       useFindAndModify: false,
  //       useNewUrlParser: true,
  //     },
  //   },
  // });

  // await server.register({
  //   plugin: Knexpg,
  //   options: {
  //     connection: config.project.postgresdb,
  //   },
  // });

  await server.register({
    plugin: firebaseAuth,
    options: {
      firebaseAdminContext: firebase,
      loadUser: true,
    },
  });

  server.auth.strategy('firebase', 'firebase', {
    firebaseAdminContext: firebase,
    loadUser: true,
  });

  await server.register({
    plugin: Routes,
    options: {
      path: './api/**/routes/*.js',
      dirname: path.join(__dirname, '../'),
    },
  });

  if (config.server.environment === 'prod') {
    await server.register({
      plugin: HapiSentry,
      options: {
        client: {
          dsn: config.project.sentry,
        },
      },
    });
    setTimeout(
      () =>
        console.log(
          `\x1b[33mEstado de Sentry: ${
            !server.plugins['hapi-sentry']
              ? '\x1b[31m ✘ Error \x1b[0m'
              : '\x1b[32m ✔ Activo \x1b[0m'
          }`
        ),
      500
    );
  }
};

module.exports = {
  register,
};
