import { format } from 'date-fns';

export default (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};
