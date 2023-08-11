const winston = require('winston');
const expressWinston = require('express-winston');

// requests
const requestsLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'requests.log' }),
  ],
  format: winston.format.json(),
});

// errors
const errorsLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'errors.log' }),
  ],
  format: winston.format.json(),
});
module.exports = {
  requestsLogger,
  errorsLogger,
};
