import { DateTime } from 'luxon';

interface TimestampNullableTransformer {
  from: (value?: Date) => DateTime | null;
  to: (value?: DateTime) => string | null;
}

const timestampNullableTransformer: TimestampNullableTransformer = {
  from: (value) => (value ? DateTime.fromJSDate(value) : null),
  to: (value) => (value ? value.toString() : null),
};

export default timestampNullableTransformer;
