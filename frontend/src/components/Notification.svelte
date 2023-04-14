<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import notificationStore, { notify } from '../components/notificationStore';

	let message = '';
	let type = 'success';
	let duration = 3000;

	onMount(() => {
		const unsubscribe = notificationStore.subscribe((value) => {
			message = value.message;
			type = value.type;
			duration = value.duration;
		});

		return () => unsubscribe();
	});

	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let timeout;

	function closeNotification() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			message = '';
		}, duration);
	}

	$: if (message) closeNotification();
</script>

{#if message}
	<div class={`notification ${type}`} transition:fade>
		{message}
	</div>
{:else}
	<style>
		.notification {
			display: none;
		}
	</style>
{/if}

<style>
	.notification {
		position: fixed;
		top: 4.5rem;
		right: 1rem;
		padding: 1rem;
		border-radius: 4px;
		font-weight: bold;
		text-align: center;
		z-index: 1000;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.notification:hover {
		box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-4px);
	}

	.notification.success {
		background-image: linear-gradient(to right, #4caf50, #8bc34a);
		color: #ffffff;
	}

	.notification.error {
		background-image: linear-gradient(to right, #f44336, #e91e63);
		color: #ffffff;
	}

	.notification:hover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		opacity: 0.15;
		background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent);
		animation: shine 1.5s infinite;
	}

	@keyframes shine {
		0% {
			transform: scale(0);
			opacity: 0.5;
		}
		100% {
			transform: scale(3);
			opacity: 0;
		}
	}
</style>
