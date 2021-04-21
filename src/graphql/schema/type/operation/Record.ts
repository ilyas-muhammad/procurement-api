import { objectType, enumType } from 'nexus';
import { CoreSystemParameterValueRange } from './CoreSystemParameter';

export const Record = objectType({
  name: 'Record',
  definition(t) {
    t.int('id');
    t.int('planId');
    t.int('systemId');
    t.int('systemParameterId');
    t.int('userId');
    t.string('loggedAt');
    t.string('syncedAt');
    t.float('value');
    t.string('systemType');
    t.field('status', { type: RecordStatusByEnum });
    t.field('systemParameter', { type: RecordSystemParameter, nullable: true });
    t.field('system', { type: RecordSystem, nullable: true });
  },
});

export const RecordSummary = objectType({
  name: 'RecordSummary',
  definition(t) {
    t.int('totalCount');
    t.field('data', { type: Record, list: true });
  },
});

export const RecordStatusByEnum = enumType({
  name: 'RecordStatusByEnum',
  members: ['NORMAL', 'WARNING', 'DANGER'],
});

export const RecordSystem = objectType({
  name: 'RecordSystem',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const RecordSystemParameterCategory = objectType({
  name: 'RecordSystemParameterCategory',
  definition(t) {
    t.string('name', { nullable: true });
  },
});

export const RecordSystemParameterMeasurementUnit = objectType({
  name: 'RecordSystemParameterMeasurementUnit',
  definition(t) {
    t.string('symbol', { nullable: true });
  },
});

export const RecordSystemParameter = objectType({
  name: 'RecordSystemParameter',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('valueRange', { type: CoreSystemParameterValueRange });
    t.field('category', { type: RecordSystemParameterCategory });
    t.field('measurementUnit', { type: RecordSystemParameterMeasurementUnit });
  },
});

export const RecordState = objectType({
  name: 'RecordState',
  definition(t) {
    t.field('startStopState', { type: StartStopStateRecordEnum });
    t.string('equipmentStatusState');
  },
});

export const RecordSystemTypeByEnum = enumType({
  name: 'RecordSystemTypeByEnum',
  members: ['LOCAL', 'CCR'],
});

export const StartStopStateRecordEnum = enumType({
  name: 'StartStopStateRecordEnum',
  members: ['STARTED', 'STOPPED'],
});

export const EquipmentStatusStateEnum = enumType({
  name: 'EquipmentStatusStateEnum',
  members: ['STANDBY', 'NORMAL_OPERASI', 'STANDBY_EMERGENCY', 'EMERGENCY_RUNNING', 'EMERGENCY_STOP'],
});
