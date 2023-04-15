<script>
	import { isUserLoggedIn } from '$lib/stores';
</script>

<header>
	<nav class="navbar">
		<div class="container">
			<div class="nav-logo">
				<a href="/"><h2>Issue Tracker</h2></a>
			</div>
			<div class="nav-links">
				{#if $isUserLoggedIn}
					<a href="/dashboard">Dashboard</a>
					<a href="/projects">Projects</a>
					<a href="/profile">Profile</a>
					<a href="/logout">Logout</a>
				{/if}
			</div>
		</div>
	</nav>
</header>

<style>
	header {
		width: 100%;
		background-color: #4caf50;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.navbar {
		width: 100%;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1024px;
		margin: 0 auto;
		padding: 0.5rem 1rem;
	}

	.nav-logo h2 {
		color: white;
		margin: 0;
	}

	.nav-links a {
		color: white;
		text-decoration: none;
		margin-left: 1rem;
		transition: color 0.3s;
	}

	.nav-links a:hover {
		color: #f5f5f5;
	}
</style>
