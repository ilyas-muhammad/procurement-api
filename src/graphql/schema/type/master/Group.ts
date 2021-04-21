import { objectType, enumType } from 'nexus';
import { User } from '../auth/User';

export const GroupsSortByEnum = enumType({
  name: 'GroupsSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC'],
});

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('operationUsers', { type: User, list: true });
  },
});

export const GroupsSummary = objectType({
  name: 'GroupsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Group });
  },
});
