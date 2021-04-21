import * as jwt from 'jsonwebtoken';
import { isNil } from 'ramda';
import { validateToken } from './validate';
import log from '../../logger/log';
import { getConnection } from '../../../models/logsheet/getConnection';
import AccessToken from '../../../models/logsheet/auth/AccessToken';

export interface OAuthClient {
  id: string;
  name: string;
  user: {
    id: number;
  } | null;
}

export default async (authorizationHeader: string | undefined): Promise<OAuthClient | undefined> => {
  if (isNil(authorizationHeader)) {
    return undefined;
  }

  const accessToken = authorizationHeader.replace('Bearer ', '');
  const decodedToken = jwt.decode(accessToken);

  if (isNil(decodedToken)) {
    return undefined;
  }

  const connection = await getConnection();
  const repo = connection.getRepository(AccessToken);

  const token = await repo.findOne({
    where: {
      id: typeof decodedToken === 'string' ? decodedToken : decodedToken.jti,
    },
  });

  if (isNil(token)) {
    return undefined;
  }

  const client = await validateToken(token, accessToken).catch((err) => {
    log('error', 'error validate token', {
      errorMsg: err.toString(),
      errorStack: err.stack,
    });

    return undefined;
  });

  if (isNil(client)) {
    return undefined;
  }

  return client;
};
