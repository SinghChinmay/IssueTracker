import axios from 'axios';
import { Router } from 'express';
import {
	createUser,
	getUserById,
	updateUserById,
	deleteUserById,
	createDict,
	getDictAll,
} from '../../controller/pg/userController';

const userRouter = Router();

// GET /search?query=<>&userId=<>
userRouter.get('/search', async (req, res) => {
	try {
		const { query, userId } = req.query;

		if (!query || !userId || typeof query !== 'string' || typeof userId !== 'string') {
			return res.status(400).json({ message: 'Query and userId, both are required' });
		}

		const user = await getUserById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// make a call to the dictionary api https://api.dictionaryapi.dev/api/v2/entries/en/<word>
		const queryResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);

		// save the query to the dict table
		await createDict(userId, query, queryResponse.data);

		return res.status(200).json(queryResponse.data);
	} catch (error) {
		return res.status(500).json({ message: 'Error fetching data', error });
	}
});

// get data from dictory table
userRouter.get('/dict', async (req, res) => {
	try {
		const dict = await getDictAll();
		res.status(200).json(dict);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching dict', error });
	}
});

// Create a new user
userRouter.post('/', async (req, res) => {
	try {
		const newUser = await createUser(req.body);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error });
	}
});

// Get a user by id
userRouter.get('/:id', async (req, res) => {
	try {
		const user = await getUserById(req.params.id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user', error });
	}
});

// Update a user by id
userRouter.put('/:id', async (req, res) => {
	try {
		const updatedUser = await updateUserById(req.params.id, req.body);
		if (updatedUser) {
			res.status(200).json(updatedUser);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error });
	}
});

// Delete a user by id
userRouter.delete('/:id', async (req, res) => {
	try {
		await deleteUserById(req.params.id);
		res.status(200).json({ message: 'User deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error });
	}
});

export default userRouter;
