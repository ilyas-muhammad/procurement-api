import { objectType, enumType } from 'nexus';

export const GraphSystem = objectType({
  name: 'GraphSystem',
  definition(t) {
    t.list.string('labels');
    t.list.float('values');
  },
});
