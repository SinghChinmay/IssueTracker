<script>
	import Header from '../components/Header.svelte';
	import Notification from '../components/Notification.svelte';
	import { onMount } from 'svelte';
	import { loginCheck } from '$lib/loginCheck';

	onMount(async () => {
		await loginCheck();
	});
</script>

<div>
	<Header />

	<main>
		<Notification />
		<slot />
	</main>

	<footer>
		<div>
			<div>
				<a href="/"><h3>Issue Tracker</h3></a>
			</div>
			<div>
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
				<a href="/privacy">Privacy Policy</a>
			</div>
		</div>
	</footer>
</div>
