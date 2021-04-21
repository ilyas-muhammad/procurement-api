import { Kind } from 'graphql';
import { DateTime } from 'luxon';
import { scalarType } from 'nexus';

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return DateTime.fromISO(value);
  },
  serialize(value: DateTime) {
    return value.toISO();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return DateTime.fromISO(ast.value);
    }
    return null;
  },
});
