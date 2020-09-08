const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async ({ params }, res) => {
  const movie = await Movie.findById(params.id);

  if (!movie) return res.status(404).send(messages.notFound);

  res.send(movie);
});

router.post('/', auth, async ({ body }, res) => {
  //Validate
  const { error } = validate(body);
  if (error) return res.status(400).send(error.message);

  //Validate genre
  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title: body.title,
    genre: { _id: genre._id, name: genre.name }, //Store only properties we want
    numberInStock: body.numberInStock,
    dailyRentalRate: body.dailyRentalRate,
  });

  await movie.save();

  res.send(movie);
});

router.put('/:id', auth, async ({ body, params }, res) => {
  //Validate movie
  const { error } = validate(body);
  if (error) return res.status(400).send(error.message);

  //Validate genre
  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findByIdAndUpdate(
    params.id,
    {
      title: body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: body.numberInStock,
      dailyRentalRate: body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send(messages.notFound);

  res.send(movie);
});

router.delete('/:id', auth, async ({ params }, res) => {
  //Validate if exists
  const deleted = await Movie.findByIdAndRemove(params.id);

  if (!deleted) return res.status(404).send(messages.notFound);

  res.send(deleted);
});

module.exports = router;
