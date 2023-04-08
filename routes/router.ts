import { Router } from 'express';
import authRoute from './authRoutes';

const routes = Router();

routes.use('/auth', authRoute);

export default routes;
