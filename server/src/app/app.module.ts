import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { UploadScalar } from '../common/scalars/upload.scalar';
import { ChatsModule } from '../chats/chats.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { Request, Response } from 'express';

@Module({
  imports: [
    AuthModule,
    SupabaseModule,
    UsersModule,
    ChatsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
        customScalarTypeMapping: {
          Upload: 'FileUpload',
        },
        additionalHeader: 'import { FileUpload } from "graphql-upload-ts";',
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: (connectionParams) => {
            return { connectionParams };
          },
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams: any) => {
            return { connectionParams };
          },
        },
      },
    }),
  ],
  providers: [AppService, DateScalar, UploadScalar],
})
export class AppModule {}
