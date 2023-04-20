import { Router } from 'express';
import { authenticate } from '../../controller/mongo/authController';
import * as profileController from '../../controller/profileController';

const profileRouter = Router();

// Protected routes below
profileRouter.use(authenticate(['user', 'admin']));

profileRouter.get('/me', profileController.getMyProfile);
profileRouter.patch('/me', profileController.updateMyProfile);
profileRouter.patch('/add', profileController.addToArray);
profileRouter.patch('/remove', profileController.removeFromArray);

// admin routes below
profileRouter.use(authenticate(['admin']));

// get all profiles
profileRouter.get('/all', profileController.getAllProfiles);
// get profile by id
profileRouter.get('/:id', profileController.getProfileById);

export default profileRouter;
