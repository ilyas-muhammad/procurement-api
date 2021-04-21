import { objectType, enumType } from 'nexus';

export const StartStopState = objectType({
  name: 'StartStopState',
  definition(t) {
    t.int('id');
    t.string('syncedAt');
    t.int('systemId');
    t.int('unitId');
    t.string('startStopState', { nullable: true });
    t.string('equipmentStatusState', { nullable: true });
  },
});

export const StartStopStateByEnum = enumType({
  name: 'StartStopStateByEnum',
  members: ['STARTED', 'STOPPED'],
});
