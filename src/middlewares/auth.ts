import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UnauthorizedError } from '../errors/customErrors';

interface JwtPayload {
  _id: string;
}
const secretKey = process.env.JWT_KEY as string;
export default (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    return next(new UnauthorizedError());
  }
  req.user = payload;

  return next();
};
