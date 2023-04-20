import { Request, NextFunction } from 'express';
import Profile from '../../models/profile';
import { AuthenticatedResponse } from '../../util/reponseInterfaces';
import * as factory from './default';

const Model = {
	default: Profile,
};

const getMyProfile = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	res.locals.identifier = { user: res.locals.user.id };
	factory.getOne(Model, req, res, next);
};

const updateMyProfile = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	res.locals.identifier = { user: res.locals.user.id };
	factory.updateOne(Model, req, res, next);
};

const getAllProfiles = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	factory.getAll(Model, req, res, next);
};

const getProfileById = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	factory.getOne(Model, req, res, next);
};

// Add a new item to the array field
const addToArray = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	res.locals.identifier = { user: res.locals.user.id };
	const { arrayField, item } = req.body;
	factory.addToArray(Model, req, res, next, arrayField, item);
};

// Remove an item from the array field
const removeFromArray = async (req: Request, res: AuthenticatedResponse, next: NextFunction) => {
	res.locals.identifier = { user: res.locals.user.id };
	const { arrayField, item } = req.body;
	factory.removeFromArray(Model, req, res, next, arrayField, item);
};

export { getMyProfile, updateMyProfile, getAllProfiles, getProfileById, addToArray, removeFromArray };
