import { Request, NextFunction } from 'express';
import Profile from '../models/profile';
import { AuthenticatedResponse } from '../util/reponseInterfaces';
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

export { getMyProfile, updateMyProfile, getAllProfiles };
