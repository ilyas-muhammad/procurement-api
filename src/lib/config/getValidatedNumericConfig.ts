import getValidatedConfig from './getValidatedConfig';

export default (configName: string): number => {
  const config = getValidatedConfig(configName);

  return parseInt(config, 10);
};
