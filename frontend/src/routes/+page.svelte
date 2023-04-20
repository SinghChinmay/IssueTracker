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
		<div>
			<button on:click={() => (isLogin = true)}> Login </button>
			<button on:click={() => (isLogin = false)}> Register </button>
		</div>
		<div>
			{#if isLogin}
				<Login />
			{:else}
				<Registration />
			{/if}
		</div>
	</section>
</main>
