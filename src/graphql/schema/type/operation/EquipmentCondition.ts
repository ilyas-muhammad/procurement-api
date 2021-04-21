import { objectType, enumType } from 'nexus';

export const EquipmentCondition = objectType({
  name: 'EquipmentCondition',
  definition(t) {
    t.int('id');
    t.int('systemId');
    t.string('systemName', { nullable: true });
    t.string('systemKKSNumber', { nullable: true });
    t.int('planId');
    t.string('photos', { list: true, nullable: true });
    t.string('status');
    t.string('description', { nullable: true });
    t.string('syncedAt');
  },
});

export const EquipmentConditionStatusEnum = enumType({
  name: 'EquipmentConditionStatusEnum',
  members: ['NORMAL', 'ABNORMAL'],
});
