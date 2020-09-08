const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const validateBody = require('../middleware/validateBody');
const { Movie } = require('../models/movie');
const { Rental } = require('../models/rental');
const { messages } = require('../config.json');

router.post('/', [auth, validateBody(validate)], async ({ body }, res) => {
  const rental = await Rental.lookup(body.customerId, body.movieId);

  if (!rental) return res.status(404).send(messages.notFound);

  if (rental.dateReturned) return res.status(400).send('Already processed');

  rental.return();

  await rental.save();

  await Movie.findByIdAndUpdate(body.movieId, {
    $inc: { numberInStock: 1 },
  });

  res.send(rental);
});

function validate(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
