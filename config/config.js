module.exports = {
  server: {
    environment: process.env.NODE_ENV || 'dev',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 9000,
    corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:9000',
    rootEndPoint: process.env.ROOT_END_POINT || 'api',
  },
  project: {
    name: process.env.APP_NAME || 'App Server',
    sentry: process.env.SENTRY_DSN || '',
    postgresdb: process.env.PG_CONNECTION || '',
    mongodb: process.env.MONGO_DB || '',
    databaseURL: process.env.DB_URL || '',
  },
  firebase: process.env.FIREBASE || '',
};
