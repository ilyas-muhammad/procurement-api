import { objectType, enumType } from 'nexus';
import { CoreSystemParameterValueRange } from './CoreSystemParameter';
import { RecordSystemParameter, RecordStatusByEnum, RecordState } from './Record';

export const SystemRecord = objectType({
  name: 'SystemRecord',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('status', { type: RecordStatusByEnum });
    t.field('systemParameter', { type: RecordSystemParameter, nullable: true });
    t.field('state', { type: RecordState, nullable: true });
  },
});

export const SystemRecordSummary = objectType({
  name: 'SystemRecordSummary',
  definition(t) {
    t.int('totalCount');
    t.field('data', { type: SystemRecord, list: true });
  },
});
