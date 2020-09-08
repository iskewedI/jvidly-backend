const mongoose = require('mongoose');

module.exports = function ({ params }, res, next) {
  if (!mongoose.Types.ObjectId.isValid(params.id))
    return res.status(404).send('Invalid ID');

  next();
};
