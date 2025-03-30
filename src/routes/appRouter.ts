import { Router } from 'express';
import usersRouter from './user';
import cardsRouter from './cards';

const appRouter = Router();

appRouter.use(usersRouter);
appRouter.use(cardsRouter);

export default appRouter;
