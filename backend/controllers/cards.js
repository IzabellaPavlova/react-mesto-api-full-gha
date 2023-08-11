const mongoose = require('mongoose');
const Cards = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const {
  CREATED,
  OK,
} = require('../utils/status_codes');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Карточка не создана. Данные не прошли валидацию.'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findById(cardId)
    .orFail(new NotFoundError(`Карточка с указанным _id = ${cardId} не найдена`))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError());
      }
      return Cards.deleteOne(card).then(() => res.status(OK).send(card));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным _id = ${req.params.cardId} не найдена`));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным _id = ${req.params.cardId} не найдена`));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
