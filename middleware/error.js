const winston = require('winston');

module.exports = function (ex, req, res, next) {
  //Levels => First Argument => error -> warn -> info -> verbose -> debug -> silly
  //Will log errors up to the level we assign => Ex. choosen "verbose" will log Errors Warnings Infos & Verbose logs
  // winston.log("error", ex.message);
  winston.error(ex.message, ex);
  res.status(500).send('Something failed.');
};
