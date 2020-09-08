const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validateBody = require('../middleware/validateBody');
const { Genre, validate } = require('../models/genre');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');

  res.send(genres);
});

router.get('/:id', validateObjectId, async ({ params }, res) => {
  const genre = await Genre.findById(params.id);

  if (!genre) {
    return res.status(404).send(messages.notFound);
  }

  res.send(genre);
});

//Auth middleware function
router.post('/', [auth, validateBody(validate)], async ({ body }, res) => {
  //Adding new element
  const genre = new Genre({
    name: body.name,
  });

  await genre.save();
  res.send(genre);
});

router.put('/:id', [auth, validateBody(validate)], async ({ body, params }, res) => {
  const genre = await Genre.findByIdAndUpdate(
    params.id,
    { name: body.name },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send(messages.notFound);
  }

  res.send(genre);
});

//Requires two authorization middlewares
router.delete('/:id', [auth, admin], async ({ params }, res) => {
  //Validate if exists
  const deleted = await Genre.findByIdAndRemove(params.id);

  if (!deleted) {
    return res.status(404).send(messages.notFound);
  }

  res.send(deleted);
});

module.exports = router;
