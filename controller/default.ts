/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// deault mongoose function pass model name as collection name with req res next

import { NextFunction, Request } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import { Redis } from '../databases/redisClient';
import { AppError } from '../error/globalErrorHandler';
import catchAsync from '../util/catchAsync';
import { isRedisAvailable } from '../util/env';
import { LOG } from '../util/logger';
import { AuthenticatedResponse, IdentifierForDB } from '../util/reponseInterfaces';

// default mongoDB type
export interface MongoDBType {
	default: mongoose.Model<mongoose.Document>;
}

/**
 * @param {string | IdentifierForDB} id
 * @param {MongoDBType} Model
 *
 * @description
 * Check if id is valid and return document.
 * If id is not valid, throw an error.
 * If document is not found, throw an error.
 * If document is found, return the document.
 * Works with both string ids and IdentifierForDB objects.
 *
 * @example
 * // Using a string id from req.params.id
 * const doc = await checkIdIsValid(req.params.id, Model);
 *
 * @example
 * // Using an IdentifierForDB object from res.locals.identifier
 * const doc = await checkIdIsValid(res.locals.identifier, Model);
 */

async function checkIdIsValid(id: string | IdentifierForDB, Model: MongoDBType) {
	let query: FilterQuery<mongoose.Document>;

	if (typeof id === 'string') {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError(`Invalid MongoDB ID ${id}`, 404);
		}
		query = { _id: id };
	} else {
		const value = Object.values(id);
		if (!value.every((val) => mongoose.Types.ObjectId.isValid(val))) {
			throw new AppError('Invalid MongoDB ID', 404);
		}
		query = id;
	}

	const doc = await Model.default.findOne(query);
	if (!doc) {
		throw new AppError('No document found', 404);
	}
	return doc;
}

export const createOne = catchAsync(
	async (Model: MongoDBType, req: Request, res: AuthenticatedResponse, _next: NextFunction) => {
		const doc = await Model.default.create(req.body);
		res.status(201).json({
			status: 'success',
			data: doc,
		});
	},
);

export const getAll = catchAsync(
	async (Model: MongoDBType, req: Request, res: AuthenticatedResponse, _next: NextFunction) => {
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
	},
);

export const getOne = catchAsync(
	async (Model: MongoDBType, req: Request, res: AuthenticatedResponse, _next: NextFunction) => {
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
		const doc = await checkIdIsValid(res.locals.identifier || req.params.id, Model);

		// check if redis is available
		if (isRedisAvailable()) {
			// set data in redis cache for 5 seconds and send it to client
			Redis.setEx(req.originalUrl, 5, JSON.stringify(doc));
		}

		return res.status(200).json({
			status: 'success',
			data: doc,
		});
	},
);

export const updateOne = catchAsync(
	async (Model: MongoDBType, req: Request, res: AuthenticatedResponse, _next: NextFunction) => {
		const { body } = req;

		// check if body is empty
		if (Object.keys(body).length === 0) {
			throw new AppError('No data provided', 400);
		}

		checkIdIsValid(res.locals.identifier || req.params.id, Model);

		if (res.locals.identifier) {
			const doc = await Model.default.findOneAndUpdate(res.locals.identifier, body, {
				new: true,
				runValidators: true,
			});

			res.status(200).json({
				status: 'success',
				data: doc,
			});
		} else {
			const doc = await Model.default.findByIdAndUpdate(req.params.id, body, {
				new: true,
				runValidators: true,
			});

			res.status(200).json({
				status: 'success',
				data: doc,
			});
		}
	},
);

export const deleteOne = catchAsync(
	async (Model: MongoDBType, req: Request, res: AuthenticatedResponse, _next: NextFunction) => {
		await checkIdIsValid(res.locals.identifier || req.params.id, Model);
		await Model.default.findByIdAndDelete(res.locals.identifier || req.params.id);
		// 204 means no content
		res.sendStatus(204);
	},
);
