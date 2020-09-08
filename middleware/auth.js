const jwt = require('jsonwebtoken');
const config = require('config');
const { messages } = require('../config.json');

//Authorization middleware
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send(messages.noTokenProvided);
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //Drop exception if invalid
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send(messages.invalidToken);
  }
};
