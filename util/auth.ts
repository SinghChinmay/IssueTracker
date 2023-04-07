// authorization middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../DB/user';
import { GetENV } from './env';
import { compareHash, hash } from './hashing';

const createJWT = (id: string) => {
	const payload = {
		id,
	};
	const token = jwt.sign(payload, GetENV('JWT_SECRET'), { expiresIn: GetENV('JWT_EXPIRES_IN') });
	return token;
};

const userLogin = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			error: 'Bad Request',
			message: 'Please provide a valid email and password',
		});
	}

	// check if user exists
	const doc = await User.findOne({ email }, { passwordHash: 1 });
	if (!doc) {
		return res.status(404).json({
			error: 'Not Found',
			message: 'User not found',
		});
	}

	// check if password is correct
	if (!compareHash(password, doc.passwordHash)) {
		return res.status(401).json({
			error: 'Unauthorized',
			message: 'Incorrect password',
		});
	}

	// create token
	const token = createJWT(doc.id);

	res.cookie('jwt', token, {
		expires: new Date(Date.now() + parseInt(GetENV('JWT_COOKIE_EXPIRES_IN'), 10) * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	});

	return res.status(200).json({
		status: 'success',
		message: 'Login successful',
	});
};

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

export { userLogin, encryptInputKey };
