import { isNil } from 'ramda';
import getConfig from './getConfig';

export default (configName: string): string => {
  const config = getConfig(configName);

  if (isNil(config)) {
    throw new Error(`Configuration ${configName} MUST be set in env file`);
  }

  return config;
};
