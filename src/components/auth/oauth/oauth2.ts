// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

import * as jwt from 'jsonwebtoken';
import * as oauth2orize from 'oauth2orize';
import * as passport from 'passport';
import log from '../../logger/log';
import config from './config';
import utils from './utils';
import { validateUser, validateRefreshToken, generateToken, generateTokens } from './validate';
import { getConnection } from '../../../models/logsheet/getConnection';
import User from '../../../models/logsheet/auth/User';
import Client from '../../../models/logsheet/auth/Client';
import { isNil } from 'ramda';
import AccessToken from '../../../models/logsheet/auth/AccessToken';
import RefreshToken from '../../../models/logsheet/auth/RefreshToken';

// create OAuth 2.0 server
const server = oauth2orize.createServer();

// Configured expiresIn
// eslint-disable-next-line @typescript-eslint/camelcase
const expiresIn = { expires_in: config.accessToken.expiresIn };

/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
server.exchange(
  oauth2orize.exchange.password(async (client: Client, username: string, password: string, scope, done) => {
    const connection = await getConnection();
    const repo = connection.getRepository(User);

    try {
      let user = await repo.findOne({
        where: {
          username,
        },
      });

      user = await validateUser(user, password);

      const tokens = await generateTokens({ scope, userId: user.id, clientId: client.id });

      if (tokens.length === 1) {
        return done(null, tokens[0], undefined, expiresIn);
      }

      if (tokens.length === 2) {
        return done(null, tokens[0], tokens[1], expiresIn);
      }

      throw new Error('Error exchanging password for tokens');
    } catch (err) {
      log('error', err);
      done(err, false);
    }
  }),
);

/**
 * Exchange the client id and password/secret for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id and
 * password/secret from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the client who authorized the code.
 */
server.exchange(
  oauth2orize.exchange.clientCredentials(async (client: Client, scope: string[] | string, done) => {
    const token = utils.createToken({
      exp: config.accessToken.expiresIn,
      sub: client.id,
    });

    const expiresAt = utils.calculateTokenExpiration(config.accessToken.expiresIn);
    const decodedToken = jwt.decode(token);

    if (isNil(decodedToken)) {
      return done(new Error('Invalid token'), false);
    }

    const connection = await getConnection();
    const repo = connection.getRepository(AccessToken);

    const accessToken = new AccessToken();

    accessToken.clientId = client.id;
    accessToken.expiresAt = expiresAt;
    accessToken.id = typeof decodedToken === 'string' ? decodedToken : decodedToken.jti;
    accessToken.scope = typeof scope === 'string' ? scope : scope.join(',');

    return repo
      .save(accessToken)
      .then(() => done(null, token, undefined, expiresIn))
      .catch((err) => {
        log('error', err);
        return done(err, false);
      });
  }),
);

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */
server.exchange(
  oauth2orize.exchange.refreshToken(async (client, refreshToken: string, _scope, done) => {
    try {
      const decodedToken = jwt.decode(refreshToken);

      if (isNil(decodedToken)) {
        return done(null, false);
      }

      const connection = await getConnection();
      const repo = connection.getRepository(RefreshToken);

      let foundRefreshToken = await repo.findOne({
        where: { id: typeof decodedToken === 'string' ? decodedToken : decodedToken.jti },
        relations: ['accessToken'],
      });

      foundRefreshToken = validateRefreshToken(foundRefreshToken, refreshToken, client);

      const oldAccessToken = foundRefreshToken.accessToken;

      if (isNil(oldAccessToken)) {
        throw new Error('Original access token not found');
      }

      const newAccessToken = await generateToken({
        clientId: oldAccessToken.clientId,
        scope: oldAccessToken.scope ? oldAccessToken.scope.split(',') : [],
        userId: oldAccessToken.userId,
      });

      done(null, newAccessToken, undefined, expiresIn);
    } catch (err) {
      log('error', err);
      done(err, false);
    }
  }),
);

/**
 * Token endpoint
 *
 * `token` middleware handles client requests to exchange authorization grants
 * for access tokens.  Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request.  Clients must
 * authenticate when making requests to this endpoint.
 */
const tokenController = [
  passport.authenticate(['oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler(),
];

export default tokenController;

// /**
//  * Grant authorization codes
//  *
//  * The callback takes the `client` requesting authorization, the `redirectURI`
//  * (which is used as a verifier in the subsequent exchange), the authenticated
//  * `user` granting access, and their response, which contains approved scope,
//  * duration, etc. as parsed by the application.  The application issues a code,
//  * which is bound to these values, and will be exchanged for an access token.
//  */
// server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, done) => {
//   const code = utils.createToken({ sub : user.id, exp : config.codeToken.expiresIn });
//   db.authorizationCodes.save(code, client.id, redirectURI, user.id, client.scope)
//   .then(() => done(null, code))
//   .catch(err => done(err));
// }));

// /**
//  * Grant implicit authorization.
//  *
//  * The callback takes the `client` requesting authorization, the authenticated
//  * `user` granting access, and their response, which contains approved scope,
//  * duration, etc. as parsed by the application.  The application issues a token,
//  * which is bound to these values.
//  */
// server.grant(oauth2orize.grant.token((client, user, ares, done) => {
//   const token      = utils.createToken({ sub : user.id, exp : config.token.expiresIn });
//   const expiration = config.token.calculateExpirationDate();
//
//   db.accessTokens.save(token, expiration, user.id, client.id, client.scope)
//   .then(() => done(null, token, expiresIn))
//   .catch(err => done(err));
// }));

// /**
//  * Exchange authorization codes for access tokens.
//  *
//  * The callback accepts the `client`, which is exchanging `code` and any
//  * `redirectURI` from the authorization request for verification.  If these values
//  * are validated, the application issues an access token on behalf of the user who
//  * authorized the code.
//  */
// server.exchange(oauth2orize.exchange.code((client, code, redirectURI, done) => {
//   db.authorizationCodes.delete(code)
//   .then(authCode => validate.authCode(code, authCode, client, redirectURI))
//   .then(authCode => validate.generateTokens(authCode))
//   .then((tokens) => {
//     if (tokens.length === 1) {
//       return done(null, tokens[0], null, expiresIn);
//     }
//     if (tokens.length === 2) {
//       return done(null, tokens[0], tokens[1], expiresIn);
//     }
//     throw new Error('Error exchanging auth code for tokens');
//   })
//   .catch(() => done(null, false));
// }));

/*
 * User authorization endpoint
 *
 * `authorization` middleware accepts a `validate` callback which is
 * responsible for validating the client making the authorization request.  In
 * doing so, is recommended that the `redirectURI` be checked against a
 * registered value, although security requirements may vary accross
 * implementations.  Once validated, the `done` callback must be invoked with
 * a `client` instance, as well as the `redirectURI` to which the user will be
 * redirected after an authorization decision is obtained.
 *
 * This middleware simply initializes a new authorization transaction.  It is
 * the application's responsibility to authenticate the user and render a dialog
 * to obtain their approval (displaying details about the client requesting
 * authorization).  We accomplish that here by routing through `ensureLoggedIn()`
 * first, and rendering the `dialog` view.
 */
// exports.authorization = [
//     login.ensureLoggedIn(),
//     server.authorization(async (clientID, redirectURI, scope, done) => {
//         const client = await models.auth.oauthClient
//             .findOne({
//                 where: {
//                     id: clientID
//                 }
//             })
//             .catch(err => done(err));
//
//         if (client) {
//             client.scope = scope; // eslint-disable-line no-param-reassign
//         }
//
//         // WARNING: For security purposes, it is highly advisable to check that
//         //          redirectURI provided by the client matches one registered with
//         //          the server.  For simplicity, this example does not.  You have
//         //          been warned.
//         return done(null, client, redirectURI);
//     }),
//     (req, res, next) => {
//         // Render the decision dialog if the client isn't a trusted client
//         // TODO:  Make a mechanism so that if this isn't a trusted client, the user can record that
//         // they have consented but also make a mechanism so that if the user revokes access to any of
//         // the clients then they will have to re-consent.
//         db.clients.findByClientId(req.query.client_id)
//             .then((client) => {
//                 if (client != null && client.trustedClient && client.trustedClient === true) {
//                     // This is how we short call the decision like the dialog below does
//                     server.decision({ loadTransaction: false }, (serverReq, callback) => {
//                         callback(null, { allow: true });
//                     })(req, res, next);
//                 } else {
//                     res.render('dialog', { transactionID: req.oauth2.transactionID,
//                      user: req.user, client: req.oauth2.client });
//                 }
//             })
//             .catch(() =>
//                 res.render('dialog', { transactionID: req.oauth2.transactionID,
//                  user: req.user, client: req.oauth2.client }));
//     }
// ];

// /**
//  * User decision endpoint
//  *
//  * `decision` middleware processes a user's decision to allow or deny access
//  * requested by a client application.  Based on the grant type requested by the
//  * client, the above grant middleware configured above will be invoked to send
//  * a response.
//  */
// exports.decision = [
//     login.ensureLoggedIn(),
//     server.decision(),
// ];

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

// server.serializeClient((client, done) => done(null, client.id));
//
// server.deserializeClient((id, done) => {
//     db.clients.find(id)
//         .then(client => done(null, client))
//         .catch(err => done(err));
// });
