import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<number, Date> {
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

  parseLiteral(ast: any): Date {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
