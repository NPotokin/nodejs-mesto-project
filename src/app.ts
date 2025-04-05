import { errors } from 'celebrate';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import appRouter from './routes/appRouter';
import errorHandler from './middlewares/errorHandler';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { validateCreateUser, validateLogin } from './requestValidators/userValidator';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();
const { PORT } = process.env;
const mongoUrl = process.env.MONGO_URL;

async function startServer() {
  try {
    await mongoose.connect(mongoUrl!);

    app.use(express.json());

    app.use(requestLogger);

    app.post('/signup', validateCreateUser, createUser);
    app.post('/signin', validateLogin, login);

    app.use(auth);
    app.use(appRouter);

    app.use(errorLogger);

    app.use(errors());
    app.use(errorHandler);

    app.listen(PORT);
  } catch (error) {
    process.exit(1);
  }
}

startServer();
