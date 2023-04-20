/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-catch */
import { EntityManager } from 'typeorm';
import { Dict } from '../../entity/Dict';
import { User } from '../../entity/User';

import { datasource } from '../../index';

// Create a new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
	const userRepository = datasource.getRepository(User);
	const newUser = userRepository.create(userData);
	await userRepository.save(newUser);
	return newUser;
};

// Get a user by id
export const getUserById = async (id: any): Promise<User | null> => {
	try {
		const userRepository = datasource.getRepository(User);
		return userRepository.findOne({
			where: { id },
		});
	} catch (error) {
		return null;
	}
};

// Update a user by id
export const updateUserById = async (id: string, updates: Partial<User>): Promise<User | null> => {
	const userRepository = datasource.getRepository(User);
	await userRepository.update(id, updates);
	return userRepository.findOne({
		where: { id },
	});
};

// Delete a user by id
export const deleteUserById = async (id: string): Promise<void> => {
	const userRepository = datasource.getRepository(User);
	await userRepository.delete(id);
};

// save data to dictory table
export const createDict = async (userId: string, query: string, dataFromAPI: any): Promise<Dict | null> => {
	try {
		const result = await datasource.transaction(async (transactionalEntityManager: EntityManager) => {
			const dictRepository = transactionalEntityManager.getRepository(Dict);

			const newDict = new Dict();
			newDict.userId = userId;
			newDict.word = dataFromAPI[0].word;
			newDict.data = JSON.stringify(dataFromAPI);

			await dictRepository.save(newDict);

			return newDict;
		});

		return result;
	} catch (error) {
		throw error;
	}
};
// get all data from dictory table

export const getDictAll = async (): Promise<any[]> => {
	const dictRepository = datasource.getRepository(Dict);

	const dicts = await dictRepository.query(`
  SELECT * FROM dict
`);

	return dicts;
};
