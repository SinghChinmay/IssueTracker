import { Router } from 'express';
import { login, register } from '../../controller/mongo/authController';

const authRoute = Router();

// Login route
authRoute.post('/login', login);

// Registration route
authRoute.post('/register', async (req, res, next) => {
	await register(req, res, next);
});

export default authRoute;
