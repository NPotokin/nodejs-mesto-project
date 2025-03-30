import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode: number = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  let message = 'Произошла ошибка на сервере';

  if (err.name === 'ValidationError') {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = 'Переданы некорректные данные';
  } else if (err.name === 'CastError') {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = 'Некорректный ID';
  } else if (err.code === 11000) {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = 'Такой пользователь уже существует';
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
