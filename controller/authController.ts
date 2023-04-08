/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../DB/user';
import { GetENV } from '../util/env';
import { compareHash } from '../util/hashing';
import { AuthenticatedResponse } from '../util/reponseInterfaces';

const createJWT = (id: string) => {
	const payload = {
		id,
	};
	const token = jwt.sign(payload, GetENV('JWT_SECRET'), { expiresIn: GetENV('JWT_EXPIRES_IN') });
	return token;
};

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

const login = async (req: Request, res: Response) => {
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

	res.header('Authorization', `Bearer ${token}`);

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

const authenticate =
	(allowedRoles: string[]) => async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
		try {
			const headerToken = req.headers.authorization?.split(' ')[1];
			const cookieToken = req.cookies?.jwt;
			const token = headerToken || cookieToken;

			if (!token) {
				return res.status(401).json({
					error: 'Unauthorized',
					message: 'No token provided',
				});
			}

			const decoded: any = jwt.verify(token, GetENV('JWT_SECRET'));
			const user = await User.findById(decoded.id).select('+role');

			if (!user) {
				return res.status(404).json({
					error: 'Not Found',
					message: 'User not found',
				});
			}

			if (!allowedRoles.includes(user.role)) {
				return res.status(403).json({
					error: 'Forbidden',
					message: 'You do not have permission to access this resource',
				});
			}

			res.locals.user = user;
			next();
		} catch (error) {
			res.status(401).json({
				error: 'Invalid Token',
				message: 'Invalid or expired token',
			});
		}
	};

export { register, login, authenticate };
