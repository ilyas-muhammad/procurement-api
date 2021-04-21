import { objectType, enumType } from 'nexus';

export const ShiftsSortByEnum = enumType({
  name: 'ShiftsSortByEnum',
  members: [
    'ID_ASC',
    'ID_DESC',
    'NAME_ASC',
    'NAME_DESC',
    'STARTS_AT_ASC',
    'STARTS_AT_DESC',
    'ENDS_AT_ASC',
    'ENDS_AT_DESC',
  ],
});

export const Shift = objectType({
  name: 'Shift',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('startsAt');
    t.string('endsAt');
  },
});

export const ShiftsSummary = objectType({
  name: 'ShiftsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Shift });
  },
});
