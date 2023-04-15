<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { isUserLoggedIn, user } from '$lib/stores';

	onMount(async () => {
		// delete the jwt cookie
		document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
		user.set(null);
		isUserLoggedIn.set(false);
		goto('/');
	});
</script>
