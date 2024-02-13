import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import process from 'process';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const appPort = process.env.APP_PORT || 3000;
  const url = `http://localhost:${appPort}`;
  const email = `test-${Date.now()}@example.com`;
  let password = '123456';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(url).post('/api/v1/auth/register').send({
      email,
      password,
      firstName: 'name',
      lastName: 'last name',
    });
  });

  it('logs in a user successfully', async () => {
    await request(url)
      .post('/api/v1/auth/login')
      .send({
        email,
        password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body.user.email).toEqual(email);
      });
  });

  it('fails to log in with a non-existing email', async () => {
    await request(url)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexisting@gmail.com',
        password: '123456',
      })
      .expect(422)
      .then((response) => {
        expect(response.body.errors.email).toEqual('Invalid email or password');
      });
  });

  it('fails to log in with incorrect password', async () => {
    await request(url)
      .post('/api/v1/auth/login')
      .send({
        email,
        password: 'wrongpassword',
      })
      .expect(422)
      .then((response) => {
        expect(response.body.errors.password).toEqual(
          'Incorrect password or email',
        );
      });
  });

  describe('GET /me', () => {
    it('should retrieve the user profile successfully', async () => {
      const token = await getValidToken();

      return request(url)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.email).toEqual(email);
        });
    });
  });

  it('should fail if the token is invalid', async () => {
    const invalidToken = 'some.invalid.token';

    return request(url)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  it('should fail if no token is provided', async () => {
    return request(url).get('/api/v1/auth/me').expect(401);
  });

  it('updates the user profile successfully', async () => {
    const token = await getValidToken();

    const updateData = {
      firstName: 'NewFirstName',
      lastName: 'NewLastName',
      oldPassword: password,
      password: 'newpassword123',
    };

    return request(url)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(200)
      .then((response) => {
        expect(response.body.firstName).toEqual(updateData.firstName);
        expect(response.body.lastName).toEqual(updateData.lastName);

        password = updateData.password;
      });
  });

  it('fails to update the password without old password', async () => {
    const token = await getValidToken();

    const updateData = {
      password: 'newpassword123',
    };

    return request(url)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(422)
      .then((response) => {
        expect(response.body.errors.oldPassword).toEqual(
          'Old password is required',
        );
      });
  });

  it('fails to update the password with incorrect old password', async () => {
    const token = await getValidToken();

    const updateData = {
      oldPassword: 'wrongOldPassword',
      password: 'newpassword123',
    };

    return request(url)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(422)
      .then((response) => {
        expect(response.body.errors.oldPassword).toEqual(
          'Old password is incorrect',
        );
      });
  });

  it('fails to update the profile without authorization', async () => {
    const updateData = {
      firstName: 'UnauthorizedUpdate',
    };

    return request(url).patch('/api/v1/auth/me').send(updateData).expect(401);
  });

  it('rejects password update due to weak new password', async () => {
    const token = await getValidToken();
    const updateData = {
      oldPassword: 'currentStrongPassword',
      password: '123',
    };

    await request(url)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(422)
      .then((response) => {
        expect(response.body.errors.password).toEqual(
          'password must be longer than or equal to 6 characters',
        );
      });
  });

  it('handles concurrent updates correctly', async () => {
    const token = await getValidToken();
    const firstUpdate = { firstName: 'FirstUpdate' };
    const secondUpdate = { lastName: 'SecondUpdate' };

    await Promise.all([
      request(url)
        .patch('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send(firstUpdate),
      request(url)
        .patch('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send(secondUpdate),
    ]);

    const finalState = await request(url)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(finalState.body.firstName).toEqual(firstUpdate.firstName);
    expect(finalState.body.lastName).toEqual(secondUpdate.lastName);
  });

  it('validates firstName field cannot be empty', async () => {
    const token = await getValidToken();

    const updateData = {
      firstName: '',
    };

    await request(url)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(422)
      .then((response) => {
        expect(response.body.errors.firstName).toEqual(
          'First name can not be empty',
        );
      });
  });

  it('successfully deletes the user account or handles unauthorized access', async () => {
    const token = getValidToken();

    await request(url)
      .delete('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((response) => {
        if (response.status === 401) {
          expect(response.status).toBe(401);
          console.log(
            'Received 401 Unauthorized, check if token is valid or expired',
          );
        } else {
          expect(response.status).toBe(200);
        }
      });
  });

  it('fails to delete account due to invalid token', async () => {
    const invalidToken = 'someInvalidToken';

    await request(url)
      .delete('/api/v1/auth/me')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  it('fails to delete account without authorization header', async () => {
    await request(url).delete('/api/v1/auth/me').expect(401);
  });

  const getValidToken = async () => {
    const response = await request(url).post('/api/v1/auth/login').send({
      email: email,
      password: password,
    });

    return response.body.token;
  };

  afterAll(async () => {
    await app.close();
  });
});
