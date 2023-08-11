const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationLogin, validationCreateUser } = require('../middlewares/validations');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => next(new NotFoundError('Страница не найдена!')));

module.exports = router;
