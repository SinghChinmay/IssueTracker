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
	<section>
		<h1>Welcome, {profile.username}</h1>
		<button on:click={toggleEditing}>
			{editing ? 'Cancel' : 'Edit Profile'}
		</button>
		{#if editing}
			<ProfileForm {profile} />
		{:else}
			<div>
				<!-- Left Column -->
				<div>
					<!-- Card -->
					<div>
						<!-- Card Image -->
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img src={profile.avatar || 'favicon.png'} alt="Profile Picture" />
						<!-- Card Body -->
						<div>
							<h5>Username: {profile.username}</h5>
							<p><b>Bio:</b> {profile.bio}</p>
							<div>
								<p><b>Website :</b></p>
								<a href={profile.website}>Link</a>
							</div>
							<p><b>Location:</b> {profile.location}</p>
							<p><b>Profile Type:</b> {profile.profileType}</p>
							<div>
								<p><b>GitHub:</b></p>
								<a href="https://github.com/{profile.github}">Link</a>
							</div>
						</div>

						<!-- Card Body (Social Media) -->
						<div>
							<h6>Social Media</h6>
							<div>
								<a href={profile?.social?.twitter}>Twitter</a>
								<a href={profile?.social?.facebook}>Facebook</a>
								<a href={profile?.social?.linkedin}>LinkedIn</a>
								<a href={profile?.social?.instagram}>Instagram</a>
							</div>
						</div>
					</div>
				</div>
				<!-- Right Column -->
				<div>
					<!-- Skills Section -->
					<div>
						<h4>Skills</h4>
						<p>{profile.skills.join(', ')}</p>
					</div>
					<!-- Experience Section -->
					<div>
						<h4>Experience</h4>
						{#each profile.experience as item}
							<div>
								<div>
									<h5>{item.title} at {item.company}</h5>
									<h6>
										{formatDate(item.from)} - {item.to ? formatDate(item.from) : 'Current'}
									</h6>
									<p>{item.description}</p>
								</div>
							</div>
						{/each}
					</div>
					<!-- Education Section -->
					<div>
						<h4>Education</h4>
						{#each profile.education as item}
							<div>
								<div>
									<h5>{item.degree} in {item.fieldofstudy} from {item.school}</h5>
									<h6>
										{formatDate(item.from)} - {item.to ? formatDate(item.from) : 'Current'}
									</h6>
									<p>{item.description}</p>
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
