import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from './config';
import { log } from '../../logger';
import utils from './utils';
import Client from '../../../models/logsheet/auth/Client';
import { isNil } from 'ramda';
import User from '../../../models/logsheet/auth/User';
import AccessToken from '../../../models/logsheet/auth/AccessToken';
import { getConnection } from '../../../models/logsheet/getConnection';
import RefreshToken from '../../../models/logsheet/auth/RefreshToken';
import { OAuthClient } from './getClient';

export const ERROR_MESSAGE_USER_NOT_EXIST = 'User tidak ditemukan';
export const ERROR_MESSAGE_USER_INACTIVE =
  'User telah dinonaktifkan. Mohon hubungi administrator untuk mengaktifkan kembali!';
export const ERROR_MESSAGE_INVALID_PASSWORD = 'User password salah';

/** Suppress tracing for things like unit testing */
const suppressTrace = process.env.OAUTHRECIPES_SURPRESS_TRACE === 'true';

interface AuthCodeType {
  userId?: number;
  clientId: string;
  scope: string[] | string;
}

/**
 * Log the message and throw it as an Error
 */
const logAndThrow = (message: string): never => {
  if (!suppressTrace) {
    log('error', message);
  }

  throw {
    message,
    code: 'client_error',
  };
};

/**
 * Given a client this will return the client if it exists , otherwise this will throw an error
 */
const validateClientExists = (client: Client | null | undefined): Client => {
  if (isNil(client)) {
    return logAndThrow('Client does not exist');
  }

  return client;
};

/**
 * Given a client and a client secret this return the client if it exists and its clientSecret
 * matches, otherwise this will throw an error
 */
const validateClient = (client: Client | null | undefined, clientSecret: string): Client => {
  client = validateClientExists(client);

  if (client.secret !== clientSecret) {
    return logAndThrow('Client secret does not match');
  }

  return client;
};

/**
 * Given a user this will return the user if it exists otherwise this will throw an error
 */
const validateUserExists = (user: User | null | undefined): User => {
  if (isNil(user)) {
    return logAndThrow(ERROR_MESSAGE_USER_NOT_EXIST);
  }

  return user;
};

/**
 * Given a user and a password this will return the user if it exists and the password matches,
 * otherwise this will throw an error
 */
const validateUser = async (user: User | null | undefined, password: string): Promise<User> => {
  user = validateUserExists(user);

  if (user.status !== 'ACTIVE') {
    return logAndThrow(ERROR_MESSAGE_USER_INACTIVE);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return logAndThrow(ERROR_MESSAGE_INVALID_PASSWORD);
  }

  return user;
};

/**
 * Given a token and accessToken this will return either the user or the client associated with
 * the token if valid.  Otherwise this will throw.
 * @param   {Object}  token       - The token
 * @param   {Object}  accessToken - The access token
 * @throws  {Error}   If the token is not valid
 * @returns {Promise} Resolved with the user or client associated with the token if valid
 */
const validateToken = async (token: AccessToken | null | undefined, accessToken: string): Promise<OAuthClient> => {
  if (isNil(token)) {
    return logAndThrow('empty token');
  }

  utils.verifyToken(accessToken);

  let user: User | null | undefined;

  const connection = await getConnection();

  if (!isNil(token.userId)) {
    // token is a user token
    const repo = connection.getRepository(User);

    user = await repo.findOne({ where: { id: token.userId } }).then((user) => validateUserExists(user));
  }

  const repo = connection.getRepository(Client);

  return repo
    .findOne({ where: { id: token.clientId } })
    .then((client) => validateClientExists(client))
    .then((client) => {
      const result = {
        id: client.id,
        name: client.name,
        user: !isNil(user)
          ? {
              id: user.id,
            }
          : null,
      };

      return result;
    });
};

/**
 * Given a refresh token and client this will return the refresh token if it exists and the client
 * id's match otherwise this will throw an error
 */
const validateRefreshToken = (
  token: RefreshToken | null | undefined,
  refreshToken: string,
  client: Client,
): RefreshToken => {
  utils.verifyToken(refreshToken);

  if (isNil(token)) {
    throw logAndThrow('Invalid refresh token');
  }

  if (client.id !== token.clientId) {
    throw logAndThrow('RefreshToken clientID does not match client id given');
  }

  return token;
};

/**
 * Given an auth code this will generate a access token, save that token and then return it.
 */
const generateToken = async ({ userId, clientId, scope }: AuthCodeType): Promise<string> => {
  const token = utils.createToken({ sub: userId ? userId.toString() : null, exp: config.accessToken.expiresIn });
  const decodedToken = jwt.decode(token);

  if (isNil(decodedToken)) {
    return logAndThrow('Invalid token');
  }

  const expiresAt = utils.calculateTokenExpiration(config.accessToken.expiresIn);

  const connection = await getConnection();
  const repo = connection.getRepository(AccessToken);

  await repo.insert({
    clientId: clientId,
    expiresAt: expiresAt,
    id: typeof decodedToken === 'string' ? decodedToken : decodedToken.jti,
    scope: typeof scope === 'string' ? scope : scope.join(','),
    userId: userId,
  });

  return token;
};

/**
 * Given a userId, clientID, and scope this will generate a refresh token, save it, and return it
 */
const generateRefreshToken = async ({ userId, clientId }: AuthCodeType, accessToken: string): Promise<string> => {
  const refreshToken = utils.createToken({
    sub: userId ? userId.toString() : null,
    exp: config.refreshToken.expiresIn,
  });

  const decodedRefreshToken = jwt.decode(refreshToken);

  if (isNil(decodedRefreshToken)) {
    return logAndThrow('Invalid token');
  }

  const decodedToken = jwt.decode(accessToken);

  if (isNil(decodedToken)) {
    return logAndThrow('Invalid token');
  }

  const refreshTokenId = typeof decodedRefreshToken === 'string' ? decodedRefreshToken : decodedRefreshToken.jti;
  const accessTokenId = typeof decodedToken === 'string' ? decodedToken : decodedToken.jti;
  const expiresAt = utils.calculateTokenExpiration(config.refreshToken.expiresIn);

  const connection = await getConnection();
  const repo = connection.getRepository(RefreshToken);

  await repo.insert({
    accessTokenId,
    id: refreshTokenId,
    clientId: clientId,
    expiresAt: expiresAt,
  });

  return refreshToken;
};

/**
 * I mimic openid connect's offline scope to determine if we send a refresh token or not
 * @param   {Array}   scope - The scope to check if is a refresh token if it has 'offline_access'
 * @returns {Boolean} true If the scope is offline_access, otherwise false
 */
const isRefreshToken = ({ scope }: { scope: string[] | string }): boolean => {
  return typeof scope === 'string' ? scope === 'offline_access' : scope.indexOf('offline_access') === 0;
};

/**
 * Given an auth code this will generate a access and refresh token, save both of those and return
 * them if the auth code indicates to return both.  Otherwise only an access token will be returned.
 * @param   {Object}  authCode - The auth code
 * @throws  {Error}   If the auth code does not exist or is zero
 * @returns {Promise} The resolved refresh and access tokens as an array
 */
const generateTokens = async (authCode: AuthCodeType): Promise<string[]> => {
  if (isRefreshToken(authCode)) {
    const accessToken = await generateToken(authCode);
    const refreshToken = await generateRefreshToken(authCode, accessToken);

    return [accessToken, refreshToken];
  }

  return Promise.all([generateToken(authCode)]);
};

export { generateToken, generateTokens, validateClient, validateToken, validateUser, validateRefreshToken };

// /**
//  * Given a auth code, client, and redirectURI this will return the auth code if it exists and is
//  * not 0, the client id matches it, and the redirectURI matches it, otherwise this will throw an
//  * error.
//  * @param  {Object}  code        - The auth code record from the DB
//  * @param  {Object}  authCode    - The raw auth code
//  * @param  {Object}  client      - The client profile
//  * @param  {Object}  redirectURI - The redirectURI to check against
//  * @throws {Error}   If the auth code does not exist or is zero or does not match the client or
//  *                   the redirectURI
//  * @returns {Object} The auth code token if valid
//  */
// validate.authCode = (code, authCode, client, redirectURI) => {
//   utils.verifyToken(code);
//   if (client.id !== authCode.clientID) {
//     logAndThrow('AuthCodeType clientID does not match client id given');
//   }
//   if (redirectURI !== authCode.redirectURI) {
//     logAndThrow('AuthCodeType redirectURI does not match redirectURI given');
//   }
//   return authCode;
// };

// /**
//  * Given a token this will resolve a promise with the token if it is not null and the expiration
//  * date has not been exceeded.  Otherwise this will throw a HTTP error.
//  * @param   {Object}  token - The token to check
//  * @returns {Promise} Resolved with the token if it is a valid token otherwise rejected with error
//  */
// validateTokenForHttp = token =>
//   new Promise((resolve, reject) => {
//     try {
//       utils.verifyToken(token);
//     } catch (err) {
//       const error  = new Error('invalid_token');
//       error.status = 400;
//       reject(error);
//     }
//     resolve(token);
//   });

// /**
//  * Given a token this will return the token if it is not null. Otherwise this will throw a
//  * HTTP error.
//  * @param   {Object} token - The token to check
//  * @throws  {Error}  If the client is null
//  * @returns {Object} The client if it is a valid client
//  */
// validateTokenExistsForHttp = (token) => {
//   if (token == null) {
//     const error = new Error('invalid_token');
//     error.status = 400;
//     throw error;
//   }
//   return token;
// };

// /**
//  * Given a client this will return the client if it is not null. Otherwise this will throw a
//  * HTTP error.
//  * @param   {Object} client - The client to check
//  * @throws  {Error}  If the client is null
//  * @returns {Object} The client if it is a valid client
//  */
// validateClientExistsForHttp = (client) => {
//   if (client == null) {
//     const error  = new Error('invalid_token');
//     error.status = 400;
//     throw error;
//   }
//   return client;
// };
