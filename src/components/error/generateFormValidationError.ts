import { ApolloError } from 'apollo-server-errors';
import { CLIENT_VALIDATION_ERROR } from './code';

export default (state: { [key: string]: string[] }): ApolloError => {
  return new ApolloError('Validation error', CLIENT_VALIDATION_ERROR, {
    state,
  });
};
