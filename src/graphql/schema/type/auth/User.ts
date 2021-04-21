import { objectType, enumType, interfaceType } from 'nexus';
import { RoleStatusEnum, RolePermission } from './Role';

export const UserStatusEnum = enumType({
  name: 'UserStatusEnum',
  members: ['ACTIVE', 'INACTIVE', 'DELETED'],
});

export const GenderEnum = enumType({
  name: 'GenderEnum',
  members: ['MALE', 'FEMALE'],
});

export const UsersSortByEnum = enumType({
  name: 'UsersSortByEnum',
  members: [
    'ID_ASC',
    'ID_DESC',
    'NAME_ASC',
    'NAME_DESC',
    'USERNAME_ASC',
    'USERNAME_DESC',
    'NIP_ASC',
    'NIP_DESC',
    'GENDER_ASC',
    'GENDER_DESC',
    'PHONE_ASC',
    'PHONE_DESC',
    'REGISTERED_AT_ASC',
    'REGISTERED_AT_DESC',
  ],
});

export const UserRole = objectType({
  name: 'UserRole',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('assignedAt');
    t.field('status', { type: RoleStatusEnum });
    t.field('permissions', { type: RolePermission, list: true });
  },
});

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('username');
    t.string('name');
    t.field('status', { type: UserStatusEnum });
    t.field('gender', { type: GenderEnum });
    t.string('jobTitle', { nullable: true });
    t.string('phone', { nullable: true });
    t.string('nip', { nullable: true });
    t.string('photo', { nullable: true });
    t.string('registeredAt');
    t.field('roles', { type: UserRole, list: true });
  },
});

export const UsersSummary = objectType({
  name: 'UsersSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: User });
  },
});
