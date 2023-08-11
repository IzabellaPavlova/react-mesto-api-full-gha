const MONGO_URL = process.env.PORT || 'mongodb://localhost:27017/mestodb';
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'dev-secret';

module.exports = {
  MONGO_URL,
  PORT,
  JWT_SECRET,
};
