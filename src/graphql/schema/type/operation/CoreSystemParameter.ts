import { objectType, enumType } from 'nexus';

export const CoreSystemParametersSortByEnum = enumType({
  name: 'CoreSystemParametersSortByEnum',
  members: ['SORT_NUMBER_ASC', 'SORT_NUMBER_DESC'],
});

export const CoreSystemParameterUnit = objectType({
  name: 'CoreSystemParameterUnit',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const CoreSystemParameterSystem = objectType({
  name: 'CoreSystemParameterSystem',
  definition(t) {
    t.int('id');
  },
});

export const CoreSystemParameterCategory = objectType({
  name: 'CoreSystemParameterCategory',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const CoreSystemParameterMeasurementUnit = objectType({
  name: 'CoreSystemParameterMeasurementUnit',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('symbol');
  },
});

export const CoreSystemParameterValueRange = objectType({
  name: 'CoreSystemParameterValueRange',
  definition(t) {
    t.float('extremeMin');
    t.float('min');
    t.float('max');
    t.float('extremeMax');
  },
});

export const CoreSystemParameter = objectType({
  name: 'CoreSystemParameter',
  definition(t) {
    t.int('id');
    t.field('unit', { type: CoreSystemParameterUnit });
    t.field('system', { type: CoreSystemParameterSystem });
    t.field('category', { type: CoreSystemParameterCategory });
    t.string('kksNumber');
    t.string('name');
    t.int('sortNumber');
    t.field('measurementUnit', { type: CoreSystemParameterMeasurementUnit });
    t.field('valueRange', { type: CoreSystemParameterValueRange });
  },
});

export const CoreSystemParametersSummary = objectType({
  name: 'CoreSystemParametersSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: CoreSystemParameter });
  },
});
