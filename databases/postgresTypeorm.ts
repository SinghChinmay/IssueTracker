import chalk from 'chalk';
import { DataSource, DataSourceOptions } from 'typeorm';
import { GetENV } from '../util/env';
import { LEVEL, LOG } from '../util/logger';

const postgresConnect = async (POSTGRES_DB_CONFIG: string): Promise<DataSource> => {
	try {
		let dataSourceOptions: DataSourceOptions;
		/* POSTGRES_DB_CONFIG is a string that is set in the .env file
        it can be either 'LOCAL' or 'TEST' or 'PROD' or 'DEV', etc depending on the environment
        if you are using a different environment, then you need to add a case for that environment 
        in the switch statement ("util\postgresConnect.ts) */
		switch (POSTGRES_DB_CONFIG) {
			case 'LOCAL':
				dataSourceOptions = {
					type: 'postgres',
					url: GetENV('POSTGRES_DB_URL_LOCAL'),
					entities: ['entity/*.ts'],
					synchronize: true,
					database: 'postgres',
				};
				break;
			case 'TEST':
				dataSourceOptions = {
					type: 'postgres',
					url: GetENV('POSTGRES_DB_URL_TEST')
						.replace('<username>', GetENV('POSTGRES_DB_USER_TEST'))
						.replace('<password>', GetENV('POSTGRES_DB_PASSWORD_TEST')),
					entities: ['entity/*.ts'],
					synchronize: true,
				};
				break;
			case 'PROD':
				dataSourceOptions = {
					type: 'postgres',
					url: GetENV('POSTGRES_DB_URL_PROD')
						.replace('<username>', GetENV('POSTGRES_DB_USER_PROD'))
						.replace('<password>', GetENV('POSTGRES_DB_PASSWORD_PROD')),
					entities: ['entity/*.ts'],
					synchronize: true,
				};
				break;
			case 'DEV':
				dataSourceOptions = {
					type: 'postgres',
					url: GetENV('POSTGRES_DB_URL_DEV')
						.replace('<username>', GetENV('POSTGRES_DB_USER_DEV'))
						.replace('<password>', GetENV('POSTGRES_DB_PASSWORD_DEV')),
					entities: ['entity/*.ts'],
					synchronize: true,
				};
				break;
			default:
				dataSourceOptions = {
					type: 'postgres',
					url: GetENV('POSTGRES_DB_URL_LOCAL'),
					entities: ['entity/*.ts'],
					synchronize: true,
				};
				break;
		}

		const dataSource = new DataSource(dataSourceOptions);
		await dataSource.initialize();

		LOG(`Connected to PostgreSQL with ${chalk.bold.whiteBright.bgGray(` ${POSTGRES_DB_CONFIG} `)} Config ✅`, {
			level: LEVEL.INFO,
			reqId: 'Starting-App',
		});

		return dataSource;
	} catch (error) {
		LOG(`Error connecting to PostgreSQL: ${error}, File: util\\postgresConnect.ts`, {
			reqId: 'Starting-App-Error',
			level: LEVEL.ERROR,
		});
		return process.exit(0);
	}
};

const disconnectPostgres = async (dataSource: DataSource) => {
	await dataSource.destroy();
};

export { postgresConnect, disconnectPostgres };
