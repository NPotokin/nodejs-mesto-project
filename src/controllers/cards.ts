import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import { ForbiddenError, NotFoundError } from '../errors/customErrors';

export const findAllCards = async (
  _req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const cards = await Card.find({});

    res.status(constants.HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const deleteCardById = async (
  req: Request, res: Response, next: NextFunction):Promise<void> => {
  const cardId = req.params.id;
  const userId = req.user!._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    } if (card.owner.toString() !== userId) {
      return next(new ForbiddenError('Нельзя удалить чужую карточку'));
    }
    await Card.findByIdAndDelete(card);

    res.status(constants.HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = req.user!._id;
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(constants.HTTP_STATUS_CREATED).json({
      message: 'Карточка создана',
      card,
    });
  } catch (error) {
    return next(error);
  }
};

export const addLikeToCard = async (
  req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = req.user!._id;
  const { cardId } = req.params;

  try {
    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );

    if (!likedCard) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    res.status(constants.HTTP_STATUS_OK).json({
      message: 'Лайк добавлен',
      card: likedCard,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeLikeFromCard = async (
  req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = req.user!._id;
  const { cardId } = req.params;

  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: owner } },
      { new: true },
    );

    if (!dislikedCard) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    res.status(constants.HTTP_STATUS_OK).json({
      message: 'Лайк удалён',
      card: dislikedCard,
    });
  } catch (error) {
    return next(error);
  }
};
