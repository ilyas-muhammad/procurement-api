import { AuthenticationError } from 'apollo-server-errors';
import { NOT_AUTHENTICATED } from './messages/auth';

export default (): AuthenticationError => {
  return new AuthenticationError(NOT_AUTHENTICATED);
};
