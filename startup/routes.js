const express = require('express');
const genresRoute = require('../routes/genres');
const customersRoute = require('../routes/customers');
const moviesRoute = require('../routes/movies');
const rentalsRoute = require('../routes/rentals');
const usersRoute = require('../routes/users');
const authRoute = require('../routes/auth');
const returnsRoute = require('../routes/returns');
const error = require('../middleware/error');
const cors = require('../middleware/cors');
const { endpoints } = require('../config.json');

module.exports = function (app) {
  app.use(express.json());

  app.use(cors);

  app.use(endpoints.Genres, genresRoute);
  app.use(endpoints.Customers, customersRoute);
  app.use(endpoints.Movies, moviesRoute);
  app.use(endpoints.Rentals, rentalsRoute);
  app.use(endpoints.Users, usersRoute);
  app.use(endpoints.Auth, authRoute);
  app.use(endpoints.Returns, returnsRoute);

  //Error Middleware, always LAST middleware used
  app.use(error);
};
