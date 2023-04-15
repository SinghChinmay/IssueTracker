<!-- ProfileForm.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let profile: any = {};
	const dispatch = createEventDispatcher();

	// Replace this with your API call to save the profile data
	async function saveProfile() {
		const response = await fetch('/api/profile', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(profile)
		});

		const data = await response.json();
		if (data.success) {
			dispatch('profileUpdated');
		} else {
			// Handle errors
		}
	}
</script>

<form on:submit|preventDefault={saveProfile}>
	<!-- Create form fields for the profile properties you want to edit -->
	<!-- For example: -->
	<label for="bio">Bio:</label>
	<textarea id="bio" bind:value={profile.bio} />

	<!-- Add more form fields as needed -->

	<button type="submit">Save</button>
</form>
