import { ForbiddenError } from 'apollo-server-errors';
import { FORBIDDEN_ACCESS } from './messages/auth';

export default (): ForbiddenError => {
  return new ForbiddenError(FORBIDDEN_ACCESS);
};
