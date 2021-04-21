import { makeSchema } from 'nexus';
import * as path from 'path';
import * as types from './schema';

const getSchema = () => {
  return makeSchema({
    types,
    outputs: {
      schema: path.join(__dirname, '../../nexus-generated-schema.graphql'),
      typegen: path.join(__dirname, '../../nexus-generated-types.d.ts'),
    },
    prettierConfig: path.join(__dirname, '../../.prettierrc.json'),
  });
};

export default getSchema;
