import { queryType } from 'nexus';
import healthCheck from '../mutation/fields/healtCheck';

export const Query = queryType({
  definition(t) {
    healthCheck(t);
  },
});
