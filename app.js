require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { mongoUrl } = require('./utils/config');
const { limiter } = require('./middlewares/limiter');

const { PORT = 5000 } = process.env;
const app = express();

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Успешно установлена связь с MongoDB');
  })
  .catch((error) => {
    console.log(`Произошла ошибка при установлении связи с MongoDB: ${error}`);
  });

app.use(cors({
  origin: ['http://localhost:3000', 'http://explorer-movies.nomoredomainsrocks.ru'],
  credentials: true,
}));

app.use(helmet());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
