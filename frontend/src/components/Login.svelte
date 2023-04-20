<script>
	import axios from 'axios';
	import { notify } from './notificationStore';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleLogin(event) {
		event.preventDefault();

		try {
			const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
				email,
				password
			});

			// set incoming jwt cookie from token
			document.cookie = `jwt=${response.data.token}`;

			notify(response.data.message, 'success');

			setTimeout(() => {
				goto('/profile');
			}, 1000);
		} catch (error) {
			// check error is instance of axios error and if so, log the response data
			if (error instanceof axios.AxiosError) {
				console.error('Error logging in:', error.response?.data);

				notify(error.response?.data.message, 'error');
			}
		}
	}
</script>

<div>
	<h3>Login</h3>
	<form on:submit={handleLogin}>
		<div>
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={email} required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" bind:value={password} required />
		</div>
		<button type="submit">Login</button>
	</form>
</div>
