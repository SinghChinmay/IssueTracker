import { Router } from 'express';

const profileRouter = Router();

// Show my profile
profileRouter.post('/me', userLogin);

export default profileRouter;
