export default (configName: string): string | undefined => {
  return process.env[configName];
};
