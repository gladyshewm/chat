import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { ChatsModule } from 'src/chats/chats.module';
import { DateScalar } from 'src/common/scalars/date.scalar';

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
          onConnect: (connectionParams) => {
            return { connectionParams };
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DateScalar, UploadScalar],
})
export class AppModule {}
