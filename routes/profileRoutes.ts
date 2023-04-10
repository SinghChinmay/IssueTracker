import { Router } from 'express';
import { authenticate } from '../controller/authController';
import * as profileController from '../controller/profileController';

const profileRouter = Router();

// Protected routes below
profileRouter.use(authenticate(['user', 'admin']));

profileRouter.get('/me', profileController.getMyProfile);

profileRouter.patch('/me', profileController.updateMyProfile);

// admin routes below
profileRouter.use(authenticate(['admin']));
profileRouter.get('/all', profileController.getAllProfiles);

export default profileRouter;
