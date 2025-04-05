import { Router } from 'express';
import {
  findAllUsers, findUserById, getMe, updateUser, updateUserAvatar,
} from '../controllers/user';
import { validateFindUserById, validateUpdateUser, validateUpdateUserAvatar } from '../requestValidators/userValidator';

const usersRouter = Router();
usersRouter.get('/users/me', getMe);
usersRouter.get('/users/:id', validateFindUserById, findUserById);
usersRouter.get('/users', findAllUsers);
usersRouter.patch('/users/me', validateUpdateUser, updateUser);
usersRouter.patch('/users/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default usersRouter;
