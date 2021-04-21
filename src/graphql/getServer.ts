import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import getContext from './getContext';
import getSchema from './getSchema';

import { permissions } from './shield/permissions';

const getServer = () => {
  const schema = getSchema();
  const schemaWithPermission = applyMiddleware(schema, permissions);

  const context = getContext();

  return new ApolloServer({
    context,
    schema: schemaWithPermission,
    introspection: true,
    playground: true,
    cacheControl: false,
  });
};

export default getServer;
