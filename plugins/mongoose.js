'user strict';

const mongoose = require('mongoose');

module.exports = {
  name: 'db-mongo',
  version: '1.0.0',
  async register(server, options) {
    const { uri, database, user, pass, config } = options;

    if (!user && !pass) {
      mongoose.connect(uri, config);
    } else {
      const configuration = {
        ...config,
        user,
        pass,
        database,
      };
      mongoose.connect(uri, configuration);
    }
    mongoose.set('useCreateIndex', true);

    // Se expone la base de datos en los plugins
    server.expose('db', () => mongoose);

    mongoose.connection
      .on('connected', () => {
        console.log(`\x1b[33mEstado de Mongo: \x1b[32m ✔ Activo \x1b[0m`);
      })
      .on('error', error => {
        console.log(`Ocurrió un error con Mongo: ${error.message}`);
      })
      // .on('open', () => {
      //   console.log('Open', 'Connection to database opened');
      // })
      .on('close', () => {
        console.log(`\x1b[33mEstado de Mongo: \x1b[31m ✘ Cerrado \x1b[0m`);
      })
      .on('disconnected', () => {
        console.log(`\x1b[33mEstado de Mongo: \x1b[31m ✘ Desconectado \x1b[0m`);
      });
  },
};
