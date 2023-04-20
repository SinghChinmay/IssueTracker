/* eslint-disable no-useless-catch */
import { Definition } from '../../entity/Definition';
import { Dict } from '../../entity/Dict';
import { Meaning } from '../../entity/Meaning';
import { Phonetic } from '../../entity/Phonetic';
import { User } from '../../entity/User';
import { Word } from '../../entity/Word';

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
export const createDict = async (userId: string, query: string, dataFromAPI: any): Promise<Dict> => {
	try {
		const userRepository = datasource.getRepository(User);
		const dictRepository = datasource.getRepository(Dict);
		const wordRepository = datasource.getRepository(Word);
		const phoneticRepository = datasource.getRepository(Phonetic);
		const meaningRepository = datasource.getRepository(Meaning);
		const definitionRepository = datasource.getRepository(Definition);

		const user = await userRepository.findOne({
			where: { id: userId },
		});

		if (!user) {
			throw new Error('User not found');
		}

		const wordData = dataFromAPI.find((word: any) => word.word === query);

		if (!wordData) {
			throw new Error('Word not found in the API data');
		}

		const word = new Word();
		word.word = wordData.word;

		await wordRepository.save(word);

		const phonetics = wordData.phonetics.map((phoneticData: any) => {
			const phonetic = new Phonetic();
			phonetic.text = phoneticData.text;
			phonetic.audio = phoneticData.audio;
			phonetic.sourceUrl = phoneticData.sourceUrl;
			phonetic.licenseName = phoneticData.license.name;
			phonetic.licenseUrl = phoneticData.license.url;
			phonetic.word = word;

			return phonetic;
		});

		await phoneticRepository.save(phonetics);

		const meanings = wordData.meanings.map((meaningData: any) => {
			const meaning = new Meaning();
			meaning.partOfSpeech = meaningData.partOfSpeech;
			meaning.word = word;

			const definitions = meaningData.definitions.map((definitionData: any) => {
				const definition = new Definition();
				definition.definition = definitionData.definition;
				definition.synonyms = definitionData.synonyms;
				definition.antonyms = definitionData.antonyms;
				definition.example = definitionData.example;
				definition.meaning = meaning;

				return definition;
			});

			definitionRepository.save(definitions);

			return meaning;
		});

		word.meanings = meanings; // Save the meanings to the word.meanings property
		await wordRepository.save(word); // Save the word entity with the updated meanings property
		await meaningRepository.save(meanings); // Save the meanings

		const newDict = new Dict();
		newDict.userId = user;
		newDict.word = word;

		await dictRepository.save(newDict);

		return newDict;
	} catch (error) {
		throw error;
	}
};

// get all data from dictory table
export const getDictAll = async (): Promise<Dict[]> => {
	const dictRepository = datasource.getRepository(Dict);

	return dictRepository.find({
		relations: ['userId', 'word', 'word.phonetics', 'word.meanings', 'word.meanings.definitions'],
	});
};
