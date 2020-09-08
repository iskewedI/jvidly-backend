const { messages } = require('../config.json');
module.exports = function (req, res, next) {
  //401 Unauthorized - Try to access a protected resource without providing valid key (JWT)
  //403 Forbidden - Provided a key but still doesn't authorized to access a resource (isAdmin=false)
  if (!req.user.isAdmin) return res.status(403).send(messages.accessDenied);

  next();
};
