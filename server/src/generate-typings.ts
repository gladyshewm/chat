import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  customScalarTypeMapping: {
    Upload: 'FileUpload',
  },
  additionalHeader: 'import { FileUpload } from "graphql-upload-ts";',
});
