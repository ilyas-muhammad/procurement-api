import { objectType, enumType } from 'nexus';

export const CoreSystemSuStreParametersSortByEnum = enumType({
  name: 'CoreSystemSuStreParametersSortByEnum',
  members: ['SORT_NUMBER_ASC', 'SORT_NUMBER_DESC'],
});

export const CoreSystemSuStreParameterSystem = objectType({
  name: 'CoreSystemSuStreParameterSystem',
  definition(t) {
    t.int('id');
  },
});

export const CoreSystemSuStreParameter = objectType({
  name: 'CoreSystemSuStreParameter',
  definition(t) {
    t.int('id');
    t.string('kksNumber', { nullable: true });
    t.field('system', { type: CoreSystemSuStreParameterSystem });
    t.string('name');
    t.int('sortNumber', { nullable: true });
    t.string('value');
  },
});

export const CoreSystemSuStreParametersSummary = objectType({
  name: 'CoreSystemSuStreParametersSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: CoreSystemSuStreParameter });
  },
});
