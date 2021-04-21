import { ObjectDefinitionBlock } from 'nexus/dist/definitions/objectType';

export default (t: ObjectDefinitionBlock<'Query'>): void => {
  t.field('healtCheck', {
    type: 'String',
    args: {},
    resolve: async (_, args) => {
      return 'OK';
    },
  });
};
