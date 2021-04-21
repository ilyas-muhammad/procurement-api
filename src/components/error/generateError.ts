import { ApolloError } from 'apollo-server-errors';

export default (msg: string, code: string): ApolloError => {
  return new ApolloError(msg, code, {
    state: {
      '': ['form errors'],
    },
  });
};
