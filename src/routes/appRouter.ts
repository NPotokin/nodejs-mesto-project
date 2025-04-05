import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import usersRouter from './user';
import cardsRouter from './cards';
import { NotFoundError } from '../errors/customErrors';

const appRouter = Router();

appRouter.use(usersRouter);
appRouter.use(cardsRouter);

appRouter.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'));
});

export default appRouter;
