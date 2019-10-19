const Hapi = require('@hapi/hapi');
const config = require('./config/config');
const plugins = require('./plugins');

const init = async () => {
  const host = config.server.host;
  const port = config.server.port;

  const server = Hapi.server({
    port,
    host,
    routes: {
      cors: {
        origin: (config.server.corsOrigins &&
          config.server.corsOrigins.replace(/ /g, '').split(',')) || [
          `${host}:${port}`,
        ],
      },
    },
  });

  try {
    await plugins.register(server);
    await server.start();

    console.log(
      `\x1b[34m------------- ${config.project.name} API, Server run on ${server.info.uri} ------------- \x1b[0m`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = {
  init,
};
