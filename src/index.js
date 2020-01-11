require('dotenv').config();

const database = require('./database');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

(async() => {
  await database.connect();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/v1/', require('./v1/routes'));

  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });
})();
