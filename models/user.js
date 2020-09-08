const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 }, //Hashed password!,
  isAdmin: { type: Boolean },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  );
};

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(), //User password | Can be validated with "joi-password-complexity"
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validate;
