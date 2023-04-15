<!-- Register.svelte -->
<script>
	import axios from 'axios';
	import { notify } from './notificationStore';

	let username = '';
	let name = '';
	let email = '';
	let password = '';

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleRegister(event) {
		event.preventDefault();

		try {
			const response = await axios.post('http://localhost:3000/api/v1/auth/register', {
				username,
				name,
				email,
				password
			});

			console.log(response.data);
		} catch (error) {
			// check error is instance of axios error and if so, log the response data
			if (error instanceof axios.AxiosError) {
				console.error('Error registering:', error.response?.data);

				notify(error.response?.data.message, 'error');
			}
		}
	}
</script>

<div class="register-form">
	<h3>Register</h3>
	<form on:submit={handleRegister}>
		<div class="input-group">
			<label for="username">Username (optional):</label>
			<input type="text" id="username" bind:value={username} />
		</div>
		<div class="input-group">
			<label for="name">Name:</label>
			<input type="text" id="name" bind:value={name} required />
		</div>
		<div class="input-group">
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={email} required />
		</div>
		<div class="input-group">
			<label for="password">Password:</label>
			<input type="password" id="password" bind:value={password} required />
		</div>
		<button type="submit" class="submit-button">Register</button>
	</form>
</div>

<style>
	.register-form {
		width: 100%;
		max-width: 400px;
		background-color: #f5f5f5;
		border-radius: 5px;
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h3 {
		color: #4caf50;
		margin-bottom: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}

	label {
		color: #4caf50;
		margin-bottom: 0.5rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #4caf50;
		border-radius: 5px;
	}

	.submit-button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s;
	}

	.submit-button:hover {
		background-color: #45a049;
	}
</style>
