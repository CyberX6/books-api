import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const url = 'http://localhost:3000';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('registers a new user successfully', () => {
    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: '123456',
        firstName: 'name',
        lastName: 'last name',
      })
      .expect(201);
  });

  it('fails registration with an invalid email format', () => {
    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email: 'test',
        password: '123456',
        firstName: 'name',
        lastName: 'last name',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.email).toBeDefined();
      });
  });

  it('fails registration with an existing email', async () => {
    const email = `test-${Date.now()}@example.com`;

    await request(url).post('/api/v1/auth/register').send({
      email,
      password: '123456',
      firstName: 'name',
      lastName: 'last name',
    });

    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email,
        password: '123456',
        firstName: 'name',
        lastName: 'last name',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.email).toBeDefined();
      });
  });

  it('fails registration with a password shorter than 6 characters', () => {
    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: '123',
        firstName: 'name',
        lastName: 'last name',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.password).toBeDefined();
      });
  });

  it('fails registration without a first name', () => {
    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: '123456',
        lastName: 'last name',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.firstName).toBeDefined();
      });
  });

  it('fails registration without a last name', () => {
    return request(url)
      .post('/api/v1/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: '123456',
        firstName: 'name',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.lastName).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
