import { format } from 'date-fns';

interface TimestampTransformer {
  from: (value: Date) => Date;
  to: (value: Date) => string;
}

const timestampTransformer: TimestampTransformer = {
  from: (value: Date): Date => value,
  to: (value: Date): string => format(value, 'yyyy-MM-dd HH:mm:ss'),
};

export default timestampTransformer;
