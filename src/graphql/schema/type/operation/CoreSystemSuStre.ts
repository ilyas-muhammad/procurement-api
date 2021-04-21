import { objectType, enumType } from 'nexus';

export const CoreSystemSuStreTypeEnum = enumType({
  name: 'CoreSystemSuStreTypeEnum',
  members: ['SU', 'STRE', 'CCR', 'LOCAL'],
});

export const CoreSystemSuStresSortByEnum = enumType({
  name: 'CoreSystemSuStresSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC', 'SORT_NUMBER_ASC', 'SORT_NUMBER_DESC'],
});

export const CoreSystemSuStre = objectType({
  name: 'CoreSystemSuStre',
  definition(t) {
    t.int('id');
    t.field('type', { type: CoreSystemSuStreTypeEnum });
    t.string('kksNumber');
    t.string('name');
    t.int('sortNumber');
    t.int('parentId', { nullable: true });
    t.field('subSystems', { type: CoreSystemSuStre, list: true });
  },
});

export const CoreSystemSuStresSummary = objectType({
  name: 'CoreSystemSuStresSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: CoreSystemSuStre });
  },
});
