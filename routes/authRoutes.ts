import { Router } from 'express';
import { authenticate, login, register } from '../controller/authController';
import { AuthenticatedResponse } from '../util/reponseInterfaces';

const authRoute = Router();

// Login route
authRoute.post('/login', login);

// Registration route
authRoute.post('/register', async (req, res, next) => {
	await register(req, res, next);
});

// Protected route
authRoute.get('/profile', authenticate(['user']), (_req, res: AuthenticatedResponse) => {
	res.json({
		message: `Welcome ${res.locals.user} to your profile!`,
	});
});

export default authRoute;
