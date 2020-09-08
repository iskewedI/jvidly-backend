const express = require('express');
const router = express.Router();
const { runInTransaction } = require('mongoose-transact-utils');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.get('/:id', async ({ params }, res) => {
  const rental = await Rental.findById(params.id);

  if (!rental) return res.status(404).send(messages.notFound);

  res.send(rental);
});

router.post('/', auth, async ({ body }, res) => {
  //Validate
  const { error } = validate(body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(body.customerId);
  if (!customer) return res.status(404).send(messages.notFound);

  const movie = await Movie.findById(body.movieId);
  if (!movie) return res.status(404).send(messages.notFound);

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  await runInTransaction(async () => {
    await rental.save();

    movie.numberInStock--;
    await movie.save();

    res.send(rental);
  });
});

module.exports = router;
