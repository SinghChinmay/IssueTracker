/* eslint-disable @typescript-eslint/no-explicit-any */
// ⭐🔴 Global error handling middleware using ErrorRequestHandler

import { ErrorRequestHandler, Request, Response } from 'express';
import { GetENV, envEnums } from '../util/env';
import { LOG, LEVEL } from '../util/logger';

interface ErrorResponse {
	status: 'error';
	message: string;
	production?: boolean;
	errorCode?: string;
	data?: any;
	details?: any;
	err?: any;
}

// AppError class
class AppError extends Error {
	public statusCode: number;

	public status: string;

	public isOperational: boolean;

	public constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

// mongoose validation error
function mongooseValidationError(err: any, _req: Request, res: Response) {
	const errors = Object.values(err.errors).map((e: any) => {
		if (e.name === 'CastError') {
			return `${e.path} is invalid, ${e.value} is not a valid ${e.kind}`;
		}
		return e.message;
	});

	const errorResponse: ErrorResponse = {
		status: 'error',
		message: errors.length > 1 ? errors : errors[0],
		err: GetENV(envEnums.NODE_ENV) === envEnums.DEVELOPMENT ? err : undefined,
	};

	return res.status(400).json(errorResponse);
}

// mongoose duplicate key error
function mongooseDuplicateKeyError(err: any, _req: Request, res: Response) {
	const errorResponse: ErrorResponse = {
		status: 'error',
		message: 'The request contains duplicate values for unique fields.',
		data: err.keyValue,
		err: GetENV(envEnums.NODE_ENV) === envEnums.DEVELOPMENT ? err : undefined,
	};

	return res.status(400).json(errorResponse);
}
// devlopment mode error handling
function devErrorHandler(err: any, _req: Request, res: Response) {
	LOG(err.toString(), { reqId: res.locals.reqId, level: LEVEL.ERROR });
	const error: ErrorResponse = {
		status: 'error',
		production: false,
		message: err,
	};
	return res.status(err.statusCode || 500).json(error);
}

// production mode error handling
function prodErrorHandler(err: any, _req: Request, res: Response) {
	LOG(err, { reqId: res.locals.reqId, level: LEVEL.ERROR });
	const error: ErrorResponse = {
		status: 'error',
		production: true,
		message: 'Something went wrong!',
	};

	return res.status(err.statusCode || 500).json(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	/**
	 * Operational errors are errors that we know and can handle
	 * like invalid data, invalid token, etc.
	 * These errors are not bugs, they are expected errors
	 * and we can handle them.
	 * We can send a response to the client just add
	 * err.isOperational = true
	 * err.statusCode = to any http code
	 * err.status = to any status
	 */
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}

	// entity.parse.failed
	if (err.type === 'entity.parse.failed') {
		const error: ErrorResponse = {
			status: 'error',
			message: 'Invalid JSON data',
		};
		return res.status(400).json(error);
	}

	// mongoose validation error
	if (err.name === 'ValidationError') {
		return mongooseValidationError(err, _req, res);
	}

	// mongoose duplicate key error
	if (err.code === 11000) {
		return mongooseDuplicateKeyError(err, _req, res);
	}

	// default error handling
	switch (GetENV(envEnums.NODE_ENV)) {
		case envEnums.DEVELOPMENT:
			return devErrorHandler(err, _req, res);
		case envEnums.PRODUCTION:
			return prodErrorHandler(err, _req, res);
		default:
			// eslint-disable-next-line no-case-declarations
			const error: ErrorResponse = {
				status: 'error',
				message: 'Something went wrong!',
			};
			return res.status(err.statusCode || 500).json(error);
	}
};

// any process exception or unhandled rejection
process.on('uncaughtException', (err) => {
	LOG(err, { level: LEVEL.ERROR });
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	LOG(err as any, { level: LEVEL.ERROR });
	process.exit(1);
});

export { globalErrorHandler, AppError };
