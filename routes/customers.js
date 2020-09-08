const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async ({ params }, res) => {
  const customer = await Customer.findById(params.id);

  if (!customer) {
    return res.status(404).send(messages.notFound);
  }

  res.send(customer);
});

router.post('/', auth, async ({ body }, res) => {
  //Validate
  const { error } = validate(body);
  if (error) {
    return res.status(400).send(error.message);
  }

  //Adding new element
  const customer = new Customer({ name: body.name, phone: body.phone });

  await customer.save();
  res.send(customer);
});

router.put('/:id', auth, async ({ body, params }, res) => {
  //Validate if syntax is correct
  const { error } = validate(body);
  if (error) {
    return res.status(400).send(error.message);
  }

  const customer = await Customer.findByIdAndUpdate(
    params.id,
    { name: body.name },
    { new: true }
  );

  if (!customer) {
    return res.status(404).send(messages.notFound);
  }

  res.send(customer);
});

router.delete('/:id', auth, async ({ params }, res) => {
  //Validate if exists
  const deleted = await Customer.findByIdAndRemove(params.id);

  if (!deleted) {
    return res.status(404).send(messages.notFound);
  }

  res.send(deleted);
});

module.exports = router;
