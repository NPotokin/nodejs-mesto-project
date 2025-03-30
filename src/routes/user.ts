import { Router } from 'express';
import {
  createUser, findAllUsers, findUserById, updateUser, updateUserAvatar,
} from '../controllers/user';

const usersRouter = Router();
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', findUserById);
usersRouter.get('/users', findAllUsers);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

export default usersRouter;
