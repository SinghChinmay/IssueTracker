/* eslint-disable consistent-return */
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../../models/profile';
import User from '../../models/user';
import { GetENV } from '../../util/env';
import { compareHash } from '../../util/hashing';
import { AuthenticatedResponse } from '../../util/reponseInterfaces';

const createJWT = (id: string) => {
	const payload = {
		id,
	};
	const token = jwt.sign(payload, GetENV('JWT_SECRET'), { expiresIn: GetENV('JWT_EXPIRES_IN') });
	return token;
};

const generateUniqueUsername = async (username: string) => {
	let uniqueUsername = username;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const userExists = await Profile.findOne({ username: uniqueUsername });

		if (!userExists) {
			break;
		} else {
			// Append a random string to the username
			const randomString = crypto.randomBytes(4).toString('hex');
			uniqueUsername = `${username}_${randomString}`;
		}
	}

	return uniqueUsername;
};

// Main registration function to handle user registration
const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body;

		// Generate a unique username based on the provided username or user's name
		const uniqueUsername = await generateUniqueUsername(req.body.username || name.replace(/\s/g, '').toLowerCase());

		// Create a new User instance with the provided data
		const userData = new User({ name, email, password });

		// Save the user to the database
		const user = await userData.save();

		try {
			// Create a new Profile instance for the user with the unique username
			const profile = new Profile({ user: user.id, username: uniqueUsername });

			// Save the profile to the database
			await profile.save({ validateBeforeSave: false });

			// Return the created user and profile in the response
			res.status(201).json({ user, profile });
		} catch (profileError) {
			// If profile creation fails, delete the user and pass the error to the next middleware
			await User.findByIdAndDelete(user.id);
			next(profileError);
		}
	} catch (error) {
		// If any other error occurs, pass it to the next middleware
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
		return res.status(400).json({
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

	return res.status(200).json({
		token,
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
