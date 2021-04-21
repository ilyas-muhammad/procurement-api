import { objectType, enumType } from 'nexus';

export const EquipmentStatusesSortByEnum = enumType({
  name: 'EquipmentStatusesSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC', 'SORT_NUMBER_ASC', 'SORT_NUMBER_DESC'],
});

export const EquipmentStatusColorEnum = enumType({
  name: 'EquipmentStatusColorEnum',
  members: ['NEUTRAL', 'GREEN', 'YELLOW', 'RED'],
});

export const EquipmentStatus = objectType({
  name: 'EquipmentStatus',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('color', { type: EquipmentStatusColorEnum });
    t.int('sortNumber');
  },
});

export const EquipmentStatusesSummary = objectType({
  name: 'EquipmentStatusesSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: EquipmentStatus });
  },
});
