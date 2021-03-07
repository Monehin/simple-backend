import express from 'express';
import userRouter from './user.route';

const app = express();

app.use('/', userRouter);

export default app;
