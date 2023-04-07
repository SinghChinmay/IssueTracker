/* eslint-disable no-console */
// console log logger function

import util from 'util';
import chalk from 'chalk';

// different levels of logging
// trace, debug, info, warn, error and fatal.
enum LEVEL {
	INFO = 'info',
	DEBUG = 'debug',
	WARN = 'warn',
	ERROR = 'error',
	TRACE = 'trace',
	FATAL = 'fatal',
}

type LogOptions = { level?: LEVEL; reqId?: string };

// get current date and time logging in IST and format it as DD-MM HH:MM 12hr format
/**
 * Get current date and time
 * @returns {string} - current date and time
 * @example
 * getDateTime();
 * returns 'DD/MM hh:mm:ss:ms AM/PM'
 */
function getDateTime(): string {
	const date = new Date();

	// Time
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const mm = minutes < 10 ? `0${minutes}` : minutes;
	const seconds = date.getSeconds();
	const ss = seconds < 10 ? `0${seconds}` : seconds;
	const milliseconds = date.getMilliseconds();
	// eslint-disable-next-line no-nested-ternary
	const ms = milliseconds < 10 ? `00${milliseconds}` : milliseconds < 100 ? `0${milliseconds}` : milliseconds;
	const hours12 = hours % 12;
	const hh = hours12 < 10 ? `0${hours12}` : hours12;
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Date
	const day = date.getDate();
	const DD = day < 10 ? `0${day}` : day;
	const month = date.getMonth() + 1;
	const MM = month < 10 ? `0${month}` : month;

	return `${DD}/${MM} ${hh}:${mm}:${ss}:${ms} ${ampm}`;
}

/**
 * Logger function
 * @param {string | object} message - message to log
 * @param {LogOptions} logOptions - level of message
 * @returns {void}
 * @example
 * LOG('Hello World', { level: LEVEL.INFO });
 * LOG('Hello World', { level: LEVEL.DEBUG, reqId: '1234' });
 */
function LOG(message: string | object, logOptions?: LogOptions): void {
	/**
	 * if message is empty, or an empty object, or an empty array then return
	 */

	if (!message || (typeof message === 'object' && Object.keys(message).length === 0)) {
		return;
	}

	const { reqId = '----------', level } = logOptions || {};

	let outputMsg = '';

	// when there is no level and message is an object, then use util.inspect to print the object
	if (typeof message === 'object') {
		outputMsg = util.inspect(message, false, null, true /* enable colors */);
	} else {
		outputMsg = message;
	}

	// use tab space to align the log message
	const log = `\t[${getDateTime()}]\t[${reqId}]\t${outputMsg}`;
	switch (level) {
		case 'info':
			console.info(`${chalk.bold.blue('[INFO]')}${log}`);
			break;

		case 'debug':
			console.debug(`${chalk.bold.magenta('[DEBUG]')}${log}`);
			break;

		case 'warn':
			console.warn(`${chalk.bold.yellow('[WARN]')}${log}`);
			break;

		case 'error':
			console.error(`${chalk.bold.red('[ERROR]')}${log}`);
			break;

		case 'trace':
			console.log(`${chalk.bold.cyan('[TRACE]')}${log}`);
			break;

		case 'fatal':
			console.error(`${chalk.bold.red('[FATAL]')}${log}`);
			break;

		default:
			if (process.env.NODE_ENV !== 'production') {
				console.log(`${chalk.bold.green('[DEV]')} ${log}`);
			}
			break;
	}
}

export { LOG, LEVEL, LogOptions };
