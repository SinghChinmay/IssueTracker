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
// get profile by id
profileRouter.get('/:id', profileController.getProfileById);
// get all profiles
profileRouter.get('/all', profileController.getAllProfiles);

export default profileRouter;
