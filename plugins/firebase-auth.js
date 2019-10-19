const Boom = require('@hapi/boom');
const Hoek = require('hoek');

const hapiFirebasePlugin = {
  name: 'firebase',
  version: '1.0.0',
  async register(server, options) {
    server.auth.scheme('firebase', () => {
      Hoek.assert(options, 'Missing firebase strategy options');
      Hoek.assert(
        options.firebaseAdminContext,
        'Missing firebase-admin context'
      );

      const settings = Hoek.clone(options);

      const scheme = {
        async authenticate(request, h) {
          const { authorization } = request.headers;

          if (!authorization) {
            throw Boom.unauthorized(
              null,
              'Bearer',
              settings.unauthorizedAttributes
            );
          }

          const parts = authorization.split(/\s+/);

          if (parts[0].toLowerCase() !== 'bearer') {
            throw Boom.unauthorized(
              null,
              'Bearer',
              settings.unauthorizedAttributes
            );
          }

          if (parts.length !== 2) {
            throw Boom.badRequest(
              'Bad HTTP authentication header format',
              'Bearer'
            );
          }

          const bearerToken = parts[1];

          try {
            const decodedToken = await options.firebaseAdminContext
              .auth()
              .verifyIdToken(bearerToken);
            if (options.loadUser) {
              const user = await options.firebaseAdminContext
                .auth()
                .getUser(decodedToken.uid);
              decodedToken.scope =
                user.customClaims &&
                Object.keys(user.customClaims).map(claim =>
                  user.customClaims[claim] === true ? claim : null
                );
              decodedToken.user = user;
            }
            return h.authenticated({
              credentials: decodedToken,
            });
          } catch (e) {
            return h.unauthenticated(
              Boom.unauthorized(
                e.code || 'Invalid credentials',
                'Bearer',
                settings.unauthorizedAttributes
              ),
              null
            );
          }
        },
      };

      return scheme;
    });
  },
};

module.exports = hapiFirebasePlugin;
