import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import log from '../../logger/log';
import { validateClient, validateToken } from './validate';
import { getConnection } from '../../../models/logsheet/getConnection';
import AccessToken from '../../../models/logsheet/auth/AccessToken';
import Client from '../../../models/logsheet/auth/Client';
import { isNil } from 'ramda';

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(
  new BasicStrategy(async (clientId, clientSecret, done) => {
    const connection = await getConnection();
    const repo = connection.getRepository(Client);

    repo
      .findOne({
        where: {
          id: clientId,
        },
      })
      .then((client) => validateClient(client, clientSecret))
      .then((client) => done(null, client))
      .catch((err) => {
        log('error', err);
        done(null, false);
      });
  }),
);

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(
  new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
    try {
      const connection = await getConnection();
      const repo = connection.getRepository(Client);

      let client = await repo.findOne({
        where: {
          id: clientId,
        },
      });

      client = validateClient(client, clientSecret);

      done(null, client);
    } catch (err) {
      log('error', err);
      return done(null, false);
    }
  }),
);

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 *
 * To keep this example simple, restricted scopes are not implemented, and this is just for
 * illustrative purposes
 */
passport.use(
  new BearerStrategy(async (accessToken, done) => {
    const decodedToken = jwt.decode(accessToken);

    if (isNil(decodedToken)) {
      return done(null, false);
    }

    const connection = await getConnection();
    const repo = connection.getRepository(AccessToken);

    repo
      .findOne({
        where: {
          id: typeof decodedToken === 'string' ? decodedToken : decodedToken.jti,
        },
      })
      .then((token) => validateToken(token, accessToken))
      .then((token) => done(null, token, { message: 'oke', scope: '*' }))
      .catch((err) => {
        log('error', err);
        return done(null, false);
      });
  }),
);

// /**
//  * LocalStrategy
//  *
//  * This strategy is used to authenticate users based on a username and password.
//  * Anytime a request is made to authorize an application, we must ensure that
//  * a user is logged in before asking them to approve the request.
//  */
// passport.use(new LocalStrategy((username, password, done) => {
//   db.legacy.user.find({
//       where: {
//         email: username
//       }
//   })
//   .then(user => validate.user(user, password))
//   .then(user => done(null, user))
//   .catch(() => done(null, false));
// }));

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

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//   db.users.find(id)
//   .then(user => done(null, user))
//   .catch(err => done(err));
// });
