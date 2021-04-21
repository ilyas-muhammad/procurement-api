import { parseISO } from 'date-fns';

interface DateTransformer {
  from: (value: string) => Date;
  to: (value: Date) => string;
}

const dateTransformer: DateTransformer = {
  from: (value: string): Date => parseISO(value),
  to: (value: Date): string => value.toString(),
};

export default dateTransformer;
