import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import User from '../models/user';

export const createUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Все поля (name, about, avatar) обязательны!',
    })
  }

  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(constants.HTTP_STATUS_CREATED).json(newUser);
  } catch (error) {
    return next(error);
  }
};

export const findAllUsers = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Пользователи не найдены',
      })
    }
    res.status(constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return next(error);
  }
};

export const findUserById = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Пользователь не найден',
      })
    }
    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = res.locals.user._id;
  const { name, about } = req.body;

  if (!name || !about) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Поля name и about обязательны',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Пользователь не найден',
      })
    }
    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = res.locals.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    return next({
      status: constants.HTTP_STATUS_BAD_REQUEST,
      message: 'Поле avatar обязательно',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next({
        status: constants.HTTP_STATUS_NOT_FOUND,
        message: 'Пользователь не найден',
      })
    }
    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};
