import { objectType, enumType } from 'nexus';

export const Activity = objectType({
  name: 'Activity',
  definition(t) {
    t.int('id');
    t.string('time');
    t.string('value');
  },
});

export const ActivitiesSummary = objectType({
  name: 'ActivitiesSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Activity });
  },
});
