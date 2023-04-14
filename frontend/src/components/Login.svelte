<script>
	import axios from 'axios';

	let email = '';
	let password = '';

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleLogin(event) {
		event.preventDefault();

		try {
			const response = await axios.post(
				'http://localhost:3000/api/v1/auth/login',
				{
					email,
					password
				},
				{
					withCredentials: true // This enables sending cookies with the request
				}
			);

			console.log(response.data);
		} catch (error) {
			// check error is instance of axios error and if so, log the response data
			if (error instanceof axios.AxiosError) {
				console.error('Error logging in:', error.response?.data);
			}
		}
	}
</script>

<div class="login-form">
	<h3>Login</h3>
	<form on:submit={handleLogin}>
		<div class="input-group">
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={email} required />
		</div>
		<div class="input-group">
			<label for="password">Password:</label>
			<input type="password" id="password" bind:value={password} required />
		</div>
		<button type="submit" class="submit-button">Login</button>
	</form>
</div>

<style>
	.login-form {
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
