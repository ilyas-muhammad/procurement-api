import * as Winston from 'winston';
import { getConsoleDriver } from './driver/getConsoleDriver';

const { combine, json, timestamp } = Winston.format;

type LogDriverEnum = 'CONSOLE' | 'ELASTICSEARCH';

export default (driver: LogDriverEnum): Winston.Logger => {
  const logDriverMap = {
    CONSOLE: getConsoleDriver,
  };

  const logDriver = logDriverMap[driver]();

  return Winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    exceptionHandlers: logDriver.exceptionHandlers,
    transports: logDriver.transports,
  });
};
