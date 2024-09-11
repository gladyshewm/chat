import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should perform a basic GraphQL query', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: '{\n  hello\n}',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        data: {
          hello: 'Hello World!',
        },
      });
  });
});
