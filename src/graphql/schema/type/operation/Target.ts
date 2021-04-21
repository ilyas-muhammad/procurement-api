import { objectType, enumType } from 'nexus';
import { MeasurementUnit } from '../master/MeasurementUnit';

export const Target = objectType({
  name: 'Target',
  definition(t) {
    t.int('id');
    t.string('description');
    t.field('measurement', { type: MeasurementUnit, nullable: true });
    t.int('value');
  },
});

export const TargetsSummary = objectType({
  name: 'TargetsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Target });
  },
});
