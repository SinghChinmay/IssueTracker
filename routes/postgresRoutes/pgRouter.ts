import { Router } from 'express';
import userRouter from './userRouter';

const routes = Router();

routes.use('/user', userRouter);

export default routes;
