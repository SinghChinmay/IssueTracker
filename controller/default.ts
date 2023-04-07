/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// deault mongoose function pass model name as collection name with req res next

import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Redis } from '../databases/redisClient';
import { AppError } from '../error/globalErrorHandler';
import catchAsync from '../util/catchAsync';
import { GetENV, isRedisAvailable } from '../util/env';
import { LOG } from '../util/logger';

// default mongoDB type
export interface MongoDBType {
	default: mongoose.Model<mongoose.Document>;
}

/**
 * @param {string} id
 * @param {MongoDBType} Model
 *
 * @description
 * check if id is valid and return document
 * if id is not valid throw error
 * if document is not found throw error
 * if document is found return document
 *
 * @example
 * const doc = await checkIfIdIsValid(req.params.id, Model);
 */
async function checkIfIdIsValid(id: string, Model: MongoDBType) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new AppError(`Invalid MongoDB ID ${id}`, 404);
	}
	const doc = await Model.default.findById(id);
	if (!doc) {
		throw new AppError(`No document found with that ID ${id}`, 404);
	}
	return doc;
}

export const createOne = catchAsync(async (Model: MongoDBType, req: Request, res: Response, _next: NextFunction) => {
	const doc = await Model.default.create(req.body);
	res.status(201).json({
		status: 'success',
		data: doc,
	});
});

export const getAll = catchAsync(async (Model: MongoDBType, req: Request, res: Response, _next: NextFunction) => {
	// check if redis is available
	if (isRedisAvailable()) {
		// if data is already in redis cache then return it
		const docCached = await Redis.get(req.originalUrl);

		if (docCached) {
			LOG(`Serving from Redis cache ${req.originalUrl}`, {
				reqId: res.locals.reqId,
			});
			return res.status(200).json({
				status: 'success',
				data: JSON.parse(docCached),
			});
		}
	}
	const doc = await Model.default.find();

	// check if redis is available
	if (isRedisAvailable()) {
		// set data in redis cache for 10 seconds and send it to client
		Redis.setEx(req.originalUrl, 10, JSON.stringify(doc));
	}
	return res.status(200).json({
		status: 'success',
		data: doc,
	});
});

export const getOne = catchAsync(async (Model: MongoDBType, req: Request, res: Response, _next: NextFunction) => {
	// check if redis is available
	if (isRedisAvailable()) {
		// if data is already in redis cache then return it
		const docCached = await Redis.get(req.originalUrl);

		if (docCached) {
			LOG(`Serving from Redis cache ${req.originalUrl}`, {
				reqId: res.locals.reqId,
			});
			return res.status(200).json({
				status: 'success',
				data: JSON.parse(docCached),
			});
		}
	}
	const doc = await checkIfIdIsValid(req.params.id, Model);

	// check if redis is available
	if (isRedisAvailable()) {
		// set data in redis cache for 5 seconds and send it to client
		Redis.setEx(req.originalUrl, 5, JSON.stringify(doc));
	}

	return res.status(200).json({
		status: 'success',
		data: doc,
	});
});

export const updateOne = catchAsync(async (Model: MongoDBType, req: Request, res: Response, _next: NextFunction) => {
	const { body } = req;

	// check if body is empty
	if (Object.keys(body).length === 0) {
		throw new AppError('No data provided', 400);
	}

	checkIfIdIsValid(req.params.id, Model);
	const doc = await Model.default.findByIdAndUpdate(req.params.id, body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: doc,
	});
});

export const deleteOne = catchAsync(async (Model: MongoDBType, req: Request, res: Response, _next: NextFunction) => {
	await checkIfIdIsValid(req.params.id, Model);
	await Model.default.findByIdAndDelete(req.params.id);
	// 204 means no content
	res.sendStatus(204);
});
