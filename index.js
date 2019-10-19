require('dotenv').config();

const firebase = require('firebase-admin');
const config = require('./config/config');
const server = require('./server');

const start = async () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(config.firebase)),
    databaseURL: config.project.databaseURL,
  });
  await server.init(firebase);
  console.log(
    `\x1b[33mFirebase status:${
      firebase.apps.length > 0
        ? '\x1b[32m ✔ Active \x1b[0m'
        : '\x1b[31m ✘ Error \x1b[0m'
    }`
  );
};

process.on('uncaughtException', err => {
  if (config.server.environment === 'dev') {
    console.log('Error uncaughtException: ', err);
  }
  setTimeout(() => process.exit(1), 500);
});

process.on('unhandledException', err => {
  if (config.server.environment === 'dev') {
    console.log('Error UnhandledException: ', err);
  }
  setTimeout(() => process.exit(1), 500);
});

start();
