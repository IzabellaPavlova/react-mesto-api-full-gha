require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ddos = require('./middlewares/ddos');
const errorCatcher = require('./middlewares/errorCatcher');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { PORT, MONGO_URL } = require('./utils/config');

const app = express();
mongoose.connect(MONGO_URL);

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://feierabend.nomoreparties.co',
  ],
  credentials: true,
  maxAge: 30,
}));
app.use(helmet());
app.use(ddos);
app.use(express.json());
app.use(cookieParser());
app.use(requestsLogger);

// TODO: Delete after review
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorsLogger);
app.use(errors());
app.use(errorCatcher);

app.listen(PORT, () => {
  console.log(`App has started on port ${PORT}`);
});
