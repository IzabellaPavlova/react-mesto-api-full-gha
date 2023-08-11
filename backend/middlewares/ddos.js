const rateLimit = require('express-rate-limit');

const ddos = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 request from the same IP within 15 mins
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = ddos;
