const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const validateBody = require('../middleware/validateBody');
const { messages } = require('../config.json');

router.post('/', validateBody(validate), async ({ body }, res) => {
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send(messages.invalidAuth);

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) return res.status(400).send(messages.invalidAuth);

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
