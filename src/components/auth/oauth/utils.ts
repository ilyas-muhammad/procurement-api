import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { addSeconds } from 'date-fns';
import * as path from 'path';
import * as uuid from 'uuid/v4';

/** Private certificate used for signing JSON WebTokens */
const privateKey = fs.readFileSync(path.join(__dirname, '../../../../certs/privatekey.pem'));

/** Public certificate used for verification.  Note: you could also use the private key */
const publicKey = fs.readFileSync(path.join(__dirname, '../../../../certs/certificate.pem'));

/**
 * Creates a signed JSON WebToken and returns it.  Utilizes the private certificate to create
 * the signed JWT.  For more options and other things you can change this to, please see:
 * https://github.com/auth0/node-jsonwebtoken
 */
interface CreateTokenParams {
  exp: number;
  sub: string | null;
}

const createToken = ({ exp = 3600, sub = '' }: CreateTokenParams): string => {
  const signParams = {
    exp: Math.floor(Date.now() / 1000) + exp,
    jti: uuid(),
    sub,
  };

  return jwt.sign(signParams, privateKey, {
    algorithm: 'RS256',
  });
};

/**
 * Verifies the token through the jwt library using the public certificate.
 * @param   {String} token - The token to verify
 * @throws  {Error} Error if the token could not be verified
 * @returns {Object} The token decoded and verified
 */
const verifyToken = (token: string): string | object => jwt.verify(token, publicKey);

const calculateTokenExpiration = (expiresIn: number): Date => addSeconds(new Date(), expiresIn);

export default {
  calculateTokenExpiration,
  createToken,
  verifyToken,
};
