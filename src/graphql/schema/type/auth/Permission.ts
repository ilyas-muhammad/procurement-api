import { objectType, enumType } from 'nexus';

export const PermissionsSortByEnum = enumType({
  name: 'PermissionsSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC'],
});

export const Permission = objectType({
  name: 'Permission',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('description');
  },
});

export const PermissionsSummary = objectType({
  name: 'PermissionsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Permission });
  },
});
