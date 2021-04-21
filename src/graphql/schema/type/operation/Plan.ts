import { objectType, enumType } from 'nexus';
import { Shift } from '../master/Shift';
import { Unit } from '../master/Unit';
import { Group } from '../master/Group';
import { EquipmentStatusColorEnum } from '../master/EquipmentStatus';
import { User, UserRole } from '../auth/User';
import { Activity } from './Activity';
import { CoreSystemTypeEnum, CoreSystemNFCTag } from './CoreSystem';
import { Target } from './Target';

export const PlansSortByEnum = enumType({
  name: 'PlansSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'CREATED_AT_ASC', 'CREATED_AT_DESC'],
});

export const PlansStatusByEnum = enumType({
  name: 'PlansStatusByEnum',
  members: ['STANDBY', 'ACTIVE', 'DONE'],
});

export const StartStopStateEnum = enumType({
  name: 'StartStopStateEnum',
  members: ['STARTED', 'STOPPED'],
});

export const LogsheetEquipmentStatusState = objectType({
  name: 'LogsheetEquipmentStatusState',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('color', { type: EquipmentStatusColorEnum });
  },
});

export const PlanUser = objectType({
  name: 'PlanUser',
  definition(t) {
    t.boolean('active');
    t.int('id');
    t.string('name');
    t.string('jobTitle', { nullable: true });
    t.string('phone', { nullable: true });
    t.field('roles', { type: UserRole, list: true });
  },
});

export const LogsheetSystem = objectType({
  name: 'LogsheetSystem',
  definition(t) {
    t.int('id');
    t.field('type', { type: CoreSystemTypeEnum });
    t.string('kksNumber');
    t.string('name');
    t.int('sortNumber');
    t.int('parentId', { nullable: true });
    t.boolean('equipmentStatusTracking');
    t.boolean('startStopTracking');
    t.boolean('useNFC');
    t.boolean('isValid');
    t.string('NFCTagId', { nullable: true });
    t.field('subSystems', { type: LogsheetSystem, list: true });
    t.string('startStopState');
    t.field('equipmentStatusState', { type: LogsheetEquipmentStatusState, nullable: true });
  },
});

export const Plan = objectType({
  name: 'Plan',
  definition(t) {
    t.int('id');
    t.string('number');
    t.string('date');
    t.field('shift', { type: Shift });
    t.field('unit', { type: Unit });
    t.field('group', { type: Group });
    t.field('activities', { type: Activity, list: true, nullable: true });
    t.field('targets', { type: Target, list: true, nullable: true });
    t.field('supervisor', { type: User, nullable: true });
    t.field('status', { type: PlansStatusByEnum });
    t.string('createdAt');
    t.field('createdBy', { type: User });
    t.field('users', { type: PlanUser, list: true });
    t.field('systemsCCR', { type: LogsheetSystem, list: true });
    t.field('systemsLocal', { type: LogsheetSystem, list: true });
    t.field('systemsSu', { type: LogsheetSystem, list: true });
    t.field('systemsStre', { type: LogsheetSystem, list: true });
  },
});

export const PlansSummary = objectType({
  name: 'PlansSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: Plan });
  },
});
