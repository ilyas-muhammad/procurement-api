import { objectType, enumType } from 'nexus';

export const EquipmentStatusStateQuery = objectType({
  name: 'EquipmentStatusStateQuery',
  definition(t) {
    t.int('systemId');
    t.int('unitId');
    t.string('startStopState', { nullable: true });
    t.string('equipmentStatusState', { nullable: true });
  },
});
