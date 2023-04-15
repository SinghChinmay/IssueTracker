<!-- Profile.svelte -->
<script lang="ts">
	import { user } from '$lib/stores';
	import ProfileForm from './ProfileForm.svelte';

	let profile: any = null;
	let editing = false;

	$: {
		profile = $user?.data;
		console.log(profile);
	}

	function toggleEditing() {
		editing = !editing;
	}
</script>

{#if profile}
	<section>
		<h1>Welcome {profile.username}</h1>
		<button on:click={toggleEditing}>{editing ? 'Cancel' : 'Edit Profile'}</button>
		{#if editing}
			<ProfileForm {profile} />
		{:else}
			<!-- Display the profile information here -->
			<img src={profile.avatar || 'favicon.png'} alt="{profile.username}'s avatar" class="avatar" />
			<p>{profile.username}</p>
			<p>{profile.profileType}</p>
			<!-- Display experience, education, and social media links as desired -->
		{/if}
	</section>
{:else}
	<p>Loading...</p>
{/if}

<style>
	.avatar {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin-right: 10px;
		margin-top: 10px;
		border: 1px solid #ccc;
		border-radius: 50%;
		padding: 2px;
		display: block;
	}
</style>
