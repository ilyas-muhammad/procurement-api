import log, { LogLevel } from './log';

interface LogInput {
  level: LogLevel;
  message: string;
  meta: Meta;
}

interface Meta {
  type: LogType;
  vendor: string;
  action: string;
  requestId: string;
  errorMsg?: string;
}

type LogType = 'VENDOR_REQUEST' | 'VENDOR_RESPONSE';

export default (input: LogInput) => {
  return log(input.level, input.message, input.meta);
};
