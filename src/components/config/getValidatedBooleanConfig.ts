import getValidatedConfig from './getValidatedConfig';

export default (configName: string): boolean => {
  const config = getValidatedConfig(configName);

  return config === 'true';
};
