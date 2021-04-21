import { Connection, createConnection } from 'typeorm';
import { getValidatedBooleanConfig, getValidatedConfig, getValidatedNumericConfig } from '../../lib/config';

import AccessToken from './auth/AccessToken';
import Client from './auth/Client';
import Permission from './auth/Permission';
import RefreshToken from './auth/RefreshToken';
import Role from './auth/Role';
import RolePermission from './auth/RolePermission';
import User from './auth/User';
import UserRole from './auth/UserRole';

let connection: Connection | undefined;

export const getConnection = async (): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  const host = getValidatedConfig('DB_LOGSHEET_HOST');
  const port = getValidatedNumericConfig('DB_LOGSHEET_PORT');
  const username = getValidatedConfig('DB_LOGSHEET_USERNAME');
  const password = getValidatedConfig('DB_LOGSHEET_PASSWORD');
  const database = getValidatedConfig('DB_LOGSHEET_DATABASE');
  const logging = getValidatedBooleanConfig('DB_LOGSHEET_LOGGING');

  connection = await createConnection({
    host,
    port,
    username,
    password,
    database,
    logging,
    name: 'pln_logsheet',
    type: 'mysql',
    entities: [AccessToken, Client, Permission, RefreshToken, Role, RolePermission, User, UserRole],
    logger: 'advanced-console',
  });

  return connection;
};
