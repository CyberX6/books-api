import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Books (e2e)', () => {
  let app: INestApplication;

  const url = 'http://localhost:3000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a book with valid data', async () => {
    const response = await request(url)
      .post('/api/v1/books')
      .send({
        title: 'Valid Title',
        content: [{ id: 1, text: 'Page 1 Text' }],
        author: 'Valid Author',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'Valid Title',
      content: [{ id: 1, text: 'Page 1 Text' }],
      author: 'Valid Author',
    });
  });

  it('should reject creation with missing title', async () => {
    await request(url)
      .post('/api/v1/books')
      .send({
        content: [{ id: 1, text: 'Page 1 Text' }],
        author: 'Valid Author',
      })
      .expect(422);
  });

  it('should handle special characters in title and content', async () => {
    await request(url)
      .post('/api/v1/books')
      .send({
        title: 'Special Title <script>alert("xss")</script>',
        content: [{ id: 1, text: '<b>Page 1 Bold Text</b>' }],
        author: 'Author Name 😊',
      })
      .expect(201)
      .then((response) => {
        expect(response.body.title).toEqual(
          'Special Title <script>alert("xss")</script>',
        );
        expect(response.body.content[0].text).toEqual(
          '<b>Page 1 Bold Text</b>',
        );
        expect(response.body.author).toEqual('Author Name 😊');
      });
  });

  it('should retrieve a list of books with default pagination', async () => {
    const response = await request(url).get('/api/v1/books').expect(200);

    expect(response.body).toMatchObject({
      data: expect.any(Array),
      hasNextPage: expect.any(Boolean),
    });
    expect(response.body.data.length).toBeLessThanOrEqual(10);
  });

  it('should handle pagination parameters', async () => {
    await request(url)
      .get('/api/v1/books?page=2&limit=5')
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBeLessThanOrEqual(5);
      });
  });

  it('should retrieve a book by id', async () => {
    const testBookId = 1;
    const response = await request(url)
      .get(`/api/v1/books/${testBookId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: testBookId,
      title: expect.any(String),
      content: expect.any(Array),
      author: expect.any(String),
    });
  });

  it('should return a 404 for a non-existent book ID', async () => {
    const nonExistentBookId = 9999;
    await request(url)
      .get(`/api/v1/books/${nonExistentBookId}`)
      .expect(200)
      .expect({});
  });

  it('should return a 400 for an invalid book ID format', async () => {
    const invalidBookId = 'abc';
    await request(url).get(`/api/v1/books/${invalidBookId}`).expect(500);
  });

  it('should update a book with valid data', async () => {
    const testBookId = 1;
    const updatedTitle = 'Updated Book Title';
    const response = await request(url)
      .patch(`/api/v1/books/${testBookId}`)
      .send({ title: updatedTitle })
      .expect(200);

    expect(response.body).toMatchObject({
      id: testBookId,
      title: updatedTitle,
    });
  });

  it('should return a 404 for a non-existent book ID', async () => {
    const nonExistentBookId = 9999;
    await request(url)
      .patch(`/api/v1/books/${nonExistentBookId}`)
      .send({ title: 'Any Title' })
      .expect(500);
  });

  it('should return a 400 for invalid update data', async () => {
    const testBookId = 1;
    await request(url)
      .patch(`/api/v1/books/${testBookId}`)
      .send({ title: '' })
      .expect(422)
      .then((response) => {
        expect(response.body.errors.title).toEqual(
          'Title should not be empty.',
        );
      });
  });

  it('should delete a book successfully', async () => {
    const testBookId = 1;
    await request(url).delete(`/api/v1/books/${testBookId}`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
