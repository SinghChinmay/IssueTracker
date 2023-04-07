import { Router } from 'express';
import { register } from '../controller/auth';
import { userLogin } from '../util/auth';

const authRoute = Router();

authRoute.post('/login', userLogin);

// Registration route
authRoute.post('/register', async (req, res, next) => {
	await register(req, res, next);
});

export default authRoute;
