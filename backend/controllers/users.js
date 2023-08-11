const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const Users = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const {
  CREATED,
  OK,
} = require('../utils/status_codes');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: true });
      res.status(OK).send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  Users.findById(userId)
    .orFail(new NotFoundError(`Пользователь с указанным _id = ${userId} не найден`))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail(new NotFoundError(`Пользователь с указанным _id = ${userId} не найден`))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email ${email} уже зарегистрирован`));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Профиль не обновлен. Данные не прошли валидацию.'));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь с указанным _id = ${req.user._id} не найден.`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Аватар не обновлен. Данные не прошли валидацию.'));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь с указанным _id = ${req.user._id} не найден.`));
      }
      return next(err);
    });
};

module.exports = {
  login,
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
};
