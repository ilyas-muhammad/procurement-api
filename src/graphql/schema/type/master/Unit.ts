import { objectType, enumType } from 'nexus';

export const UnitsSortByEnum = enumType({
  name: 'UnitsSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC'],
});

export const Unit = objectType({
  name: 'Unit',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const UnitsSummary = objectType({
  name: 'UnitsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Unit });
  },
});
