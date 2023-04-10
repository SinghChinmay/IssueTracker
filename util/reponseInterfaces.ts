import { Response } from 'express';
import user from '../models/user';

export type IdentifierForDB = { user: string };

export interface AuthenticatedResponse extends Response {
	locals: {
		user: InstanceType<typeof user>;
		reqId: string;
		identifier?: IdentifierForDB;
	};
}
