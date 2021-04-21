import { objectType, enumType } from 'nexus';

export const MeasurementUnitsSortByEnum = enumType({
  name: 'MeasurementUnitsSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC', 'SYMBOL_ASC', 'SYMBOL_DESC'],
});

export const MeasurementUnit = objectType({
  name: 'MeasurementUnit',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('symbol');
  },
});

export const MeasurementUnitsSummary = objectType({
  name: 'MeasurementUnitsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: MeasurementUnit });
  },
});
