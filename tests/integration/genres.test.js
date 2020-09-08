const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    await Genre.deleteMany({}); //Remove all documents
    await User.deleteMany({});

    await server.close();
  });
  describe('GET/:id', () => {
    it('should return the genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      const { status, body } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty('name', 'genre1');
    });
    it('should return 404 if invalid ID is passed', async () => {
      const id = 'InvalidID';

      const res = await request(server).get(`/api/genres/${id}`);

      const { status, body } = res;
      expect(status).toBe(404);
    });
    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server).get(`/api/genres/${id}`);

      const { status, body } = res;
      expect(status).toBe(404);
    });
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

      const res = await request(server).get('/api/genres');

      const { status, body } = res;
      expect(status).toBe(200);
      expect(body.length).toBe(2);
      expect(body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('POST /', () => {
    //1- Define the happy path
    //2- Then, we change one parameter that clearly aligns with the name of the test
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should return 400 if genre name is less than 3 characters', async () => {
      name = '12';

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if genre name is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = Genre.find({ name });

      expect(genre).not.toBeNull();
    });
    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', name);
    });
  });
  describe('PUT /:id', () => {
    let token;
    let name;

    const exec = id => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name });
    };
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });
    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exec(1);

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre name is less than 3 characters', async () => {
      name = '12';

      const res = await exec(4);

      expect(res.status).toBe(400);
    });
    it('should return 404 if genre is not found', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await exec(id);

      expect(res.status).toBe(404);
    });
    it('should return the updated genre if given ID is found', async () => {
      const genre = await new Genre({ name }).save();
      name = 'updatedName';

      const res = await exec(genre.id);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ _id: genre.id, name });
    });
  });
  describe('DELETE /:id', () => {
    let token;
    let name;

    const exec = id => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name });
    };
    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      name = 'genre1';
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exec(1);

      expect(res.status).toBe(401);
    });
    it('should return 404 if given id is not found', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await exec(id);

      expect(res.status).toBe(404);
    });
    it('should return the deleted genre if given id is found', async () => {
      const genre = await new Genre({ name }).save();

      const res = await exec(genre.id);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ _id: genre.id, name });
    });
  });
});
