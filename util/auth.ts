// authorization middleware

import { Request, Response, NextFunction } from 'express';
import { hash } from './hashing';

const encryptInputKey = (key: string) => (req: Request, res: Response, next: NextFunction) => {
	const value = req.body[key];

	if (!value) {
		res.status(400).json({
			error: 'Bad Request',
			message: `Please provide a valid ${key}`,
		});
	}
	const encryptedData = hash(value);
	req.body[`${key}Hash`] = encryptedData;
	next();
};

export { encryptInputKey };
