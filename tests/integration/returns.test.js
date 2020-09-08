const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

describe('api/returns', () => {
  let token;
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;

  beforeEach(async () => {
    server = require('../../index');

    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: 'movie title',
      dailyRentalRate: 2,
      numberInStock: 4,
      genre: { name: '1234' },
    });
    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post(`/api/returns`)
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });
  it('should return 400 if customerID is not provided', async () => {
    customerId = null;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = null;

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it('should return 404 if no rental is found for this customer/movie', async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });
  it('should return 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it('should return 200 if rental is a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
  it('should set the return date', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental.id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });
  it('should calculate the rental fee (numberOfDays * dailyRentalRate)', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental.id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it('should increase the stock number of the movie', async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movie.id);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
  it('should increase the stock number of the movie', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental.id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
