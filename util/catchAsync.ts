/* eslint-disable @typescript-eslint/ban-types */
import { NextFunction, Request, Response } from 'express';

const functionWrapper =
	(fn: Function) =>
	(Model: any, req: Request, res: Response, next: NextFunction, ...args: any[]) => {
		fn(Model, req, res, next, ...args).catch(next);
	};

export default functionWrapper;
