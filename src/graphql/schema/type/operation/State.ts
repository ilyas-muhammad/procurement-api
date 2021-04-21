import { objectType } from 'nexus';

export const State = objectType({
    name: 'State',
    definition(t) {
      t.int('systemId');
      t.int('unitId');
      t.string('startStopState', { nullable: true });
      t.string('equipmentStatusState', { nullable: true });
      t.int('runningHours', { nullable: true });
      t.string('lastStop', { nullable: true });
      t.string('lastStart', { nullable: true });
    },
  });