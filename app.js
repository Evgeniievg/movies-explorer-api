require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');
const { mongoUrl } = require('./utils/config');

const { PORT = 5000 } = process.env;
const app = express();

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Успешно установлена связь с MongoDB');
  })
  .catch((error) => {
    console.log(`Произошла ошибка при установлении связи с MongoDB: ${error}`);
  });

app.use(helmet());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
