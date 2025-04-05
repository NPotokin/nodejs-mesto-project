import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import 'dotenv/config';
import { NotFoundError, UnauthorizedError } from '../errors/customErrors';

const secretKey = process.env.JWT_KEY as string;
export const createUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.status(constants.HTTP_STATUS_CREATED).json(newUser);
  } catch (error) {
    return next(error);
  }
};

export const findAllUsers = async (
  _req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const users = await User.find({});

    res.status(constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return next(error);
  }
};

export const findUserById = async (
  req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = req.user!._id;
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUserAvatar = async (
  req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = req.user!._id;
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign(
      { _id: user._id },
      secretKey,
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(constants.HTTP_STATUS_OK).send({ message: 'Добро пожаловать!' });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const userId = req.user!._id;
  try {
    const user = await User.findById(userId);

    res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};
