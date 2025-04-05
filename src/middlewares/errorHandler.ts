import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { AppError } from '../errors/customErrors';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  let message = statusCode !== constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? err.message : 'На сервере произошла ошибка';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = 'Переданы некорректные данные';
  } else if (err.name === 'CastError') {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = 'Некорректный ID';
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
