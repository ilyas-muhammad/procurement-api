import { defaultTo, merge } from 'ramda';
import getLogger from './getLogger';

const logger = getLogger('CONSOLE');

export type LogLevel = 'info' | 'error';

export default (level: LogLevel, message: string, meta: object = {}) => {
  const mergedMeta = merge(
    {
      app: 'api',
      env: defaultTo('development', process.env.APP_ENV),
    },
    meta,
  );

  return logger.log(level, message, mergedMeta);
};
