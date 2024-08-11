import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode, Kind } from '../../../node_modules/graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number | string): Date {
    return new Date(value);
  }

  serialize(value: Date | string): number {
    if (typeof value === 'string') {
      return new Date(value).getTime();
    }
    return value.getTime();
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

  parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
