import * as Transports from 'winston-transport';
import log from './log';
import logClientRequest from './logClientRequest';
import logError from './logError';
import logVendor from './logVendor';

export interface Driver {
  exceptionHandlers: Transports[];
  transports: Transports[];
}

export { log, logClientRequest, logError, logVendor };
