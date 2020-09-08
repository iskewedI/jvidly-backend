const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(); //Logger initialization
require('./startup/routes')(app); //Routes settings
require('./startup/db')(); //Database initialization
require('./startup/config')(); //Environment configuration
require('./startup/validation')(); //Api Validation initialization
require('./startup/prod')(app); //Middlewares needed to PROD app

//Startup of listener
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
