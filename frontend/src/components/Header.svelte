<script>
	import { isUserLoggedIn } from '$lib/stores';
</script>

<header>
	<nav>
		<a href="/"><h2>Issue Tracker</h2></a>

		{#if $isUserLoggedIn}
			<a href="/dashboard">Dashboard</a>
			<a href="/projects">Projects</a>
			<a href="/profile">Profile</a>
			<a href="/logout">Logout</a>
		{/if}
	</nav>
</header>
