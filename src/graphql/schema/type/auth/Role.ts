import { objectType, enumType } from 'nexus';

export const RoleStatusEnum = enumType({
  name: 'RoleStatusEnum',
  members: ['ACTIVE', 'INACTIVE'],
});

export const RolesSortByEnum = enumType({
  name: 'RolesSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC', 'STATUS_ASC', 'STATUS_DESC'],
});

export const RolePermission = objectType({
  name: 'RolePermission',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('description');
    t.string('grantedAt');
  },
});

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('status', { type: RoleStatusEnum });
    t.field('permissions', { type: RolePermission, list: true });
  },
});

export const RolesSummary = objectType({
  name: 'RolesSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Role });
  },
});
