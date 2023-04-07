import { NextFunction, Request, Response } from 'express';
import User from '../DB/user';

const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body;

		const userData = new User({ name, email, password });
		const user = await userData.save();
		res.status(201).json({ user });
	} catch (error) {
		next(error);
	}
};

export { register };
