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

<div>
	<h3>Register</h3>
	<form on:submit={handleRegister}>
		<div>
			<label for="username">Username (optional):</label>
			<input type="text" id="username" bind:value={username} />
		</div>
		<div>
			<label for="name">Name:</label>
			<input type="text" id="name" bind:value={name} required />
		</div>
		<div>
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={email} required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" bind:value={password} required />
		</div>
		<button type="submit">Register</button>
	</form>
</div>
