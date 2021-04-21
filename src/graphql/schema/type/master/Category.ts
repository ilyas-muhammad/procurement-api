import { objectType, enumType } from 'nexus';

export const CategoriesSortByEnum = enumType({
  name: 'CategoriesSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC'],
});

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const CategoriesSummary = objectType({
  name: 'CategoriesSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Category });
  },
});
