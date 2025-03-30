import express from 'express';
import mongoose from 'mongoose';
import tempOwner from './middlewares/tempOwner';
import appRouter from './routes/appRouter';
import errorHandler from './middlewares/errorHandler';

const app = express();
const PORT = 3000;

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');

    app.use(express.json());
    app.use(tempOwner);
    app.use(appRouter);

    app.use(errorHandler);

    app.listen(PORT);
  } catch (error) {
    process.exit(1);
  }
}

startServer();
