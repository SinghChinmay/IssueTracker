<script>
	import Login from '../components/Login.svelte';
	import Registration from '../components/Registration.svelte';
	let isLogin = true;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
	<section>
		<h1>Issue Tracker</h1>
		<div class="toggle-buttons">
			<button
				class="toggle-button login-btn"
				on:click={() => (isLogin = true)}
				class:active={!isLogin}
			>
				Login
			</button>
			<button
				class="toggle-button register-btn"
				on:click={() => (isLogin = false)}
				class:active={isLogin}
			>
				Register
			</button>
		</div>
		<div class="container">
			{#if isLogin}
				<Login />
			{:else}
				<Registration />
			{/if}
		</div>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 1rem;
		box-sizing: border-box;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.toggle-buttons {
		display: flex;
		margin-top: 0.5rem;
	}

	.toggle-button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s;
		margin: 0 0.5rem;
	}

	.toggle-button:hover {
		background-color: #45a049;
	}

	.toggle-button.active {
		background-color: #45a049;
	}
</style>
