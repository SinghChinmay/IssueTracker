import { Request, Response, Router } from 'express';
import { userLogin } from '../util/auth';

const routes = Router();

routes.get('/', (_req: Request, res: Response) => {
	res.json({
		note: 'Welcome to the API V1 Routes',
		info: 'The Following /*/*/*/* URL paths are dymatically generated',
	});
});

routes.post('/login', userLogin);

export default routes;
