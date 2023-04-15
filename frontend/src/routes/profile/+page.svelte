<!-- Profile.svelte -->
<script lang="ts">
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';
	import ProfileForm from './ProfileForm.svelte';
	import { loginCheck } from '../../lib/loginCheck';

	let profile: any = null;
	let editing = false;

	$: {
		profile = $user?.data;
	}

	function toggleEditing() {
		editing = !editing;
	}

	onMount(async () => {
		await loginCheck();
	});

	// convert 2021-01-01T00:00:00.000Z to 2021-01-01
	function formatDate(date: string) {
		return date.split('T')[0];
	}
</script>

{#if profile}
	<section class="profile-container">
		<h1>Welcome, {profile.username}</h1>
		<button class="edit-button" on:click={toggleEditing}>
			{editing ? 'Cancel' : 'Edit Profile'}
		</button>
		{#if editing}
			<ProfileForm {profile} />
		{:else}
			<div class="content-container">
				<!-- Left Column -->
				<div class="left-column">
					<!-- Card -->
					<div class="card">
						<!-- Card Image -->
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img src={profile.avatar || 'favicon.png'} class="card-img-top" alt="Profile Picture" />
						<!-- Card Body -->
						<div class="card-body">
							<h5 class="card-title">Username: {profile.username}</h5>
							<p class="card-text"><b>Bio:</b> {profile.bio}</p>
							<div class="flex">
								<p class="card-text"><b>Website :</b></p>
								<a href={profile.website} class="website-button">Link</a>
							</div>
							<p class="card-text"><b>Location:</b> {profile.location}</p>
							<p class="card-text"><b>Profile Type:</b> {profile.profileType}</p>
							<div class="flex">
								<p class="card-text"><b>GitHub:</b></p>
								<a href="https://github.com/{profile.github}" class="website-button">Link</a>
							</div>
						</div>

						<!-- Card Body (Social Media) -->
						<div class="card-body">
							<h6 class="card-subtitle mb-2 text-muted">Social Media</h6>
							<div class="social-links">
								<a href={profile?.social?.twitter} class="card-link">Twitter</a>
								<a href={profile?.social?.facebook} class="card-link">Facebook</a>
								<a href={profile?.social?.linkedin} class="card-link">LinkedIn</a>
								<a href={profile?.social?.instagram} class="card-link">Instagram</a>
							</div>
						</div>
					</div>
				</div>
				<!-- Right Column -->
				<div class="right-column">
					<!-- Skills Section -->
					<div class="card skills">
						<h4 class="section-title">Skills</h4>
						<p>{profile.skills.join(', ')}</p>
					</div>
					<!-- Experience Section -->
					<div class="section experience">
						<h4 class="section-title">Experience</h4>
						{#each profile.experience as item}
							<div class="card">
								<div class="card-body">
									<h5 class="card-title">{item.title} at {item.company}</h5>
									<h6 class="card-subtitle mb-2 text-muted">
										{formatDate(item.from)} - {item.to ? formatDate(item.from) : 'Current'}
									</h6>
									<p class="card-text">{item.description}</p>
								</div>
							</div>
						{/each}
					</div>
					<!-- Education Section -->
					<div class="section education">
						<h4 class="section-title">Education</h4>
						{#each profile.education as item}
							<div class="card">
								<div class="card-body">
									<h5 class="card-title">
										{item.degree} in {item.fieldofstudy} from {item.school}
									</h5>
									<h6 class="card-subtitle mb-2 text-muted">
										{formatDate(item.from)} - {item.to ? formatDate(item.from) : 'Current'}
									</h6>
									<p class="card-text">{item.description}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</section>
{:else}
	<p>Loading...</p>
{/if}

<style>
	.skills {
		margin-bottom: 1rem;
		border-radius: 1rem;
		padding-left: 1.5rem;
	}
	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	.content-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;
		width: 100%;
		max-width: 1200px;
		justify-content: space-between;
	}

	.left-column,
	.right-column {
		flex-basis: 45%;
		margin-top: 2rem;
	}

	.card {
		background-color: #f8f9fa;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		margin-bottom: 2rem;
	}

	.card-img-top {
		height: 200px;
		/* align in center */
		object-fit: cover;
		object-position: center;
		width: 100%;
		border-radius: 8px;
		border: 1px solid #ddd;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.card-body {
		padding: 1rem;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.card-text {
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.list-group {
		padding: 1rem;
	}

	.list-group-item {
		border: none;
		background-color: transparent;
		margin-bottom: 0.25rem;
	}

	.social-links {
		display: flex;
		gap: 0.5rem;
	}

	.flex {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	a.website-button {
		/* a button with gradients */
		background: linear-gradient(90deg, #00ff80, #00ff73);
		border: 1px solid black;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		color: black;
	}

	a.website-button:hover {
		background: linear-gradient(90deg, #35004e, #8900b3);
		color: white;
		border: 1px solid white;
	}

	.edit-button {
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		margin-top: 0.5rem;
	}

	.edit-button:hover {
		background-color: #0056b3;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.skills ul,
	.experience ul,
	.education ul {
		list-style-type: none;
		padding: 0;
	}

	.skills li,
	.experience li,
	.education li {
		margin-bottom: 0.5rem;
	}
</style>
