import log, { LogLevel } from './log';

interface LogInput {
  level: LogLevel;
  message: string;
  meta: Meta;
}

interface Meta {
  type: LogType;
  clientId: string;
  requestId: string;
}

type LogType = 'CLIENT_REQUEST' | 'CLIENT_RESPONSE';

export default (input: LogInput) => {
  return log(input.level, input.message, input.meta);
};
