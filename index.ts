/** ******************************
 * While developing this app, use of comments is necessary 📝
 *
 * //// Console logs statements DEVELOPMENT ENV ONLY //////////////////////////////////
 * In console if you see 🟥 (RED) then there is an error 🔥
 * In console if you see 🟦 (BLUE) then there is a warning 🔥
 * In console if you see 🟩 (GREEN) then there is a success 🔥
 *
 *
 * //// Production environment ///////////////////////////////////////////////////////
 * In production environment, all development console logs statements are removed 📝
 *
 * //// Incoming and outgoing data logs ///////////////////////////////////////////////
 * Every incoming and outgoing data is logged to the console 📝
 */
// Import the required packages
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import express, { Response } from 'express';
import morgan from 'morgan';
import { DefaultAPIRoute } from './constants/router.constants';
import { mongoConnect } from './databases/mongoConnect';
import { redisClient } from './databases/redisClient';
import { globalErrorHandler } from './error/globalErrorHandler';
import { GetENV, isRedisAvailable } from './util/env';
import { NextRequestId } from './util/generator.helper';
import { LEVEL, LOG } from './util/logger';
import printRoutes from './util/printAllRoutes';
import './util/extensions';

// MongoDB connection
// wait till the connection is established to mongoDB
// before starting the server
(async () => {
	/* MONGO_DB_CONFIG is a string that is set in the .env file
	it can be either 'LOCAL' or 'TEST' or 'PROD' or 'DEV', etc depending on the environment
	if you are using a different environment, then you need to add a case for that environment 
	in the switch statement ("util\mongoConnect.ts) */
	await mongoConnect(GetENV('MONGO_DB_CONFIG'));

	// redis connection
	if (isRedisAvailable()) {
		await redisClient();
	} else {
		LOG('Redis is not available', {
			reqId: 'REDIS-WARN',
			level: LEVEL.WARN,
		});
	}

	const routes = await import('./routes/router');

	const app = express();

	// parse cookies using express middleware
	app.use(cookieParser());

	// ⭐🔴 Express middleware
	app.use(express.json({ limit: '10kb' }));
	app.use(express.urlencoded({ extended: true, limit: '10kb' }));

	app.use((req, res, next) => {
		const allowedOrigins = /.localhost.|.127.0.0.1./;
		const { origin } = req.headers;
		if (origin && allowedOrigins.test(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.setHeader('Access-Control-Allow-Credentials', 'true'); // Add this line

		// Set headers for preflight requests
		if (req.method === 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			res.status(204).end();
		} else {
			next();
		}
	});

	// requestId is a unique identifier for each request
	app.use((req, res, next) => {
		// check incoming request for requestId
		res.locals.reqId = req.headers['x-request-id'] || NextRequestId();

		// add requestId to response headers
		res.setHeader('x-request-id', res.locals.reqId);
		LOG(req.body, { reqId: res.locals.reqId });
		next();
	});

	if (GetENV('NODE_ENV') === 'development') {
		morgan.token('reqId', (_req, res: Response) => res.locals.reqId);
		app.use(
			morgan(':method :url :status :response-time ms - :res[content-length] x_reqId_x :reqId', {
				stream: {
					write: (msg) => {
						const msgArr = msg.split('x_reqId_x');
						LOG(msgArr[0], { reqId: msgArr[1].trim() });
					},
				},
			}),
		);
	}

	// router Import
	app.use(DefaultAPIRoute, routes.default);

	// Sending to pages not found
	app.all('*', (req, res) => {
		res.status(404).json({
			status: 'fail',
			message: `Can't find ${req.originalUrl} on this server!`,
		});
	});

	app.use(globalErrorHandler);

	app.listen(GetENV('EXPRESS_PORT'), () => {
		LOG(`Server started on port ${chalk.cyanBright(GetENV('EXPRESS_PORT'))} ✅`, {
			reqId: 'Starting-App',
			level: LEVEL.INFO,
		});
		printRoutes(app);
	});
})();
