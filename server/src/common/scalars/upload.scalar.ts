import { Scalar } from '@nestjs/graphql';
import { ValueNode } from '../../../node_modules/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';

@Scalar('Upload')
export class UploadScalar {
  description = 'File upload scalar type';

  parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: ValueNode) {
    return GraphQLUpload.parseLiteral(ast);
  }
}
