import log from './log';

interface Meta {
  errorStack?: string;
}

export default (message: string, meta: Meta) => {
  return log('error', message, meta);
};
