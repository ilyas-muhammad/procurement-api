import { objectType, enumType } from 'nexus';
import { State } from './State';

export const CoreSystemTypeEnum = enumType({
  name: 'CoreSystemTypeEnum',
  members: ['LOCAL', 'CCR', 'SU', 'STRE'],
});

export const CoreSystemsSortByEnum = enumType({
  name: 'CoreSystemsSortByEnum',
  members: ['ID_ASC', 'ID_DESC', 'NAME_ASC', 'NAME_DESC', 'SORT_NUMBER_ASC', 'SORT_NUMBER_DESC'],
});

export const CoreSystemNFCTagHistory = objectType({
  name: 'CoreSystemNFCTagHistory',
  definition(t) {
    t.string('NFCTagId');
    t.string('remark');
    t.string('appliedAt');
  },
});

export const CoreSystemNFCTag = objectType({
  name: 'CoreSystemNFCTag',
  definition(t) {
    t.int('systemId');
    t.int('unitId');
    t.string('NFCTagId');
    t.string('remark');
    t.string('appliedAt');
    t.field('histories', { type: CoreSystemNFCTagHistory, list: true, nullable: true });
  },
});

export const CoreSystem = objectType({
  name: 'CoreSystem',
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
    t.string('NFCTagId', { nullable: true });
    t.field('NFCTags', { type: CoreSystemNFCTag, list: true });
    t.field('State', { type: State, nullable: true });
    t.field('subSystems', { type: CoreSystem, list: true });
  },
});

export const CoreSystemsSummary = objectType({
  name: 'CoreSystemsSummary',
  definition(t) {
    t.int('totalCount');
    t.list.field('data', { type: CoreSystem });
  },
});
