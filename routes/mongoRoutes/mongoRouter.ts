import { Router } from 'express';
import authRoute from './authRoutes';
import profileRouter from './profileRoutes';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/profile', profileRouter);

export default routes;
