/* eslint-disable no-continue */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
import chalk from 'chalk';
import { Express } from 'express';
import { serverAddress } from '../constants/router.constants';
import { LOG } from './logger';

/**
 * Add colors to the log message if the message starts with
 * any of HTTP Methods
 *
 * Like GET -, POST -, PUT -, DELETE -, PATCH -, OPTIONS -
 *
 * @param {string} message - message to log
 *
 * @returns {string} - message with colors
 */
function addColors(message: string): string {
	const colors = {
		GET: chalk.bold.green,
		POST: chalk.bold.cyan,
		PUT: chalk.bold.yellow,
		DELETE: chalk.bold.red,
		PATCH: chalk.bold.magenta,
		OPTIONS: chalk.bold.cyan,
		default: chalk.bold.white.bgRedBright,
	};

	const method = message.split(' ')[0] as keyof typeof colors;

	if (method in colors) {
		return colors[method](message);
	}
	return colors.default(message);
}

function getParentRoute(inputString: string): string {
	const arr = inputString.split('/');

	const output = arr
		.filter((item, i) => {
			if (i !== arr.length - 1) {
				// return item starts with any alphabet
				return item.match(/^[a-zA-Z]/);
			}
			return false;
		})
		.map(
			// remove last character
			(item) => item.slice(0, -1),
		)
		.join('/');
	return output;
}

// print out all paths and their methods
function printRoutes(app: Express) {
	const productionRoutes: { method: string; path: string }[] = [];

	function checkStack(stack: any, routeURL = ''): void {
		let counter = 0;
		const parentRoute = routeURL + getParentRoute(stack.regexp.toString());
		LOG(addColors(parentRoute), { reqId: 'ROUTES-PARENT' });

		const routes = stack.handle.stack;

		for (let j = 0; j < routes.length; j++) {
			const route = routes[j];

			// if route.route is undefined, it means it is a middleware
			if (route.route) {
				counter++;

				const method = route.route.stack[0].method.toUpperCase();
				const { path } = route.route;
				productionRoutes.push({ method, path: `${serverAddress()}/${parentRoute}${path}` });
				LOG(addColors(`${method} - ${parentRoute}${path}`), { reqId: `ROUTE-${counter}` });
				continue;
			}

			if (route.name === 'router' && route.handle.stack) {
				checkStack(route, parentRoute);
				continue;
			}
		}
	}

	for (let i = 0; i < app._router.stack.length; i++) {
		if (app._router.stack[i].name === 'router') {
			checkStack(app._router.stack[i]);
			console.table(productionRoutes);
		}
	}
}

export default printRoutes;
