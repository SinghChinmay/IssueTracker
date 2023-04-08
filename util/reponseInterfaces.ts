import { Response } from 'express';
import user from '../DB/user';

export interface AuthenticatedResponse extends Response {
	locals: {
		user: InstanceType<typeof user>;
	};
}
