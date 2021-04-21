import { mutationType } from 'nexus';
import healthCheck from './fields/healtCheck';

export const Mutation = mutationType({
  definition(t) {
    healthCheck(t);
  },
});
