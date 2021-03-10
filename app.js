import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.options('*', cors());

import apiRoutes from './src/routes';
import mongoose from 'mongoose';

import { db } from './config';

const MONGODB_URL = process.env.MONGODB_URL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL);
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });

mongoose.connection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Welcome');
});

app.use('/api/', apiRoutes);

app.get('*', function (req, res, next) {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);

  error.statusCode = 301;

  next(error);
});

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
  return res.status(error.statusCode).json({ error: error });
});

export default app;
