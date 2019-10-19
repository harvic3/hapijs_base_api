const glob = require('glob');
const path = require('path');
const config = require('../config/config');

const routesPlugin = {
  name: 'hapiHighway',
  version: '1.0.0',
  register(server, options) {
    const dirname = options.dirname || __dirname;
    (options && options.path && glob)
      .sync(options.path, {
        root: dirname,
      })
      .forEach(file => {
        const filePath = path.resolve(dirname, file);
        const routes = require(filePath);
        if (routes.length) {
          routes.forEach(route => {
            route.path = `${config.server.rootEndPoint}${route.path}`;
            server.route(route);
            console.log(`Ruta registrada: ${route.method} - ${route.path}`);
          });
        } else {
          routes.path = `${config.server.rootEndPoint}${routes.path}`;
          server.route(routes);
          console.log(`Ruta registrada: ${routes.method} - ${routes.path}`);
        }
      });
  },
};

module.exports = routesPlugin;
