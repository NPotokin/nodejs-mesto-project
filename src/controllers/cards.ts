import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card';

export const findAllCards = async (_req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const cards = await Card.find({});
    if (!cards || cards.length === 0) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Карточки не найдены',
      })
    }
     res.status(constants.HTTP_STATUS_OK).send(cards);
  } catch (error) {
     return next(error);
  }
};

export const deleteCardById = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const cardId = req.params.id;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Карточка не найдена'
      })
    }
    res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = res.locals.user?._id;
  const { name, link } = req.body;

  if (!name || !link || !owner) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Все поля (name, link, owner) обязательны!',
    })
  }

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

export const addLikeToCard = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = res.locals.user?._id;
  const { cardId } = req.params;

  if (!cardId || !owner) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Все поля (cardId, owner) обязательны!',
    })
  }

  try {
    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );

    if (!likedCard) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Карточка не найдена',
      })
    }

    res.status(constants.HTTP_STATUS_OK).json({
      message: 'Лайк добавлен',
      card: likedCard,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeLikeFromCard = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const owner = res.locals.user?._id;
  const { cardId } = req.params;

  if (!cardId || !owner) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Все поля (cardId, owner) обязательны!',
    })
  }

  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: owner } },
      { new: true },
    );

    if (!dislikedCard) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Карточка не найдена',
      })
    }
    res.status(constants.HTTP_STATUS_OK).json({
      message: 'Лайк удалён',
      card: dislikedCard,
    });
  } catch (error) {
    return next(error);
  }
};
