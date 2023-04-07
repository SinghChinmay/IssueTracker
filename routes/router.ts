import { Router } from 'express';
import authRoute from './auth';

const routes = Router();

routes.use('/auth', authRoute);

export default routes;
