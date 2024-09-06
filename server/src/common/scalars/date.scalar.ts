import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode, Kind } from '../../../node_modules/graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    throw new Error('Invalid value for Date scalar');
  }

  serialize(value: unknown): number {
    if (typeof value === 'string') {
      return new Date(value).getTime();
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error('Invalid value for Date serialization');
  }

  /* serialize(value: Date | string): string {
    if (!(value instanceof Date)) {
      value = new Date(value);
    }

    if (isNaN(value.getTime())) {
      throw new RangeError('Invalid time value');
    }

    const formatter = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return formatter.format(value);
  } */

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('Invalid literal for Date scalar');
  }
}
