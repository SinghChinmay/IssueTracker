<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import notificationStore from '../components/notificationStore';

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
	let timeout: string | number | NodeJS.Timeout | undefined;

	function closeNotification() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			dragging = false; // Reset dragging state
			message = '';
		}, duration);
	}

	$: if (message) closeNotification();

	let dragging = false;
	let offsetX = 0;
	let offsetY = 0;
	let positionX = 0;
	let positionY = 0;

	function handlePointerDown(event: any) {
		dragging = true;
		offsetX = event.clientX - event.target.getBoundingClientRect().left;
		offsetY = event.clientY - event.target.getBoundingClientRect().top;
		event.target.setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: any) {
		if (!dragging) return;
		positionX = event.clientX - offsetX;
		positionY = event.clientY - offsetY;
		event.target.style.transform = `translate(${positionX}px, ${positionY}px)`;
	}

	function handlePointerUp(event: any) {
		dragging = false;
		event.target.releasePointerCapture(event.pointerId);
	}

	onMount(() => {
		// Calculate the initial centered position
		positionX = window.innerWidth / 2 - window.innerWidth / 4; // Assume notification width is 300px
		positionY = window.innerHeight / 2; // Adjust the position under the header as desired
	});
</script>

{#if message}
	<div
		class={`notification ${type} ${dragging ? 'dragging' : ''}`}
		transition:fade
		on:pointerdown={handlePointerDown}
		on:pointermove={handlePointerMove}
		on:pointerup={handlePointerUp}
		style={`transform: translate(${positionX}px, ${positionY}px);`}
	>
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
		position: absolute;
		padding: 1rem;
		width: 50%;
		border-radius: 4px;
		text-align: center;
		z-index: 1000;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.notification:hover {
		box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-4px);
		/* show dragging icon */
		cursor: move;
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

	.notification.dragging {
		opacity: 0.5;
		transition: none !important;
	}

	.notification.dragging:hover::before {
		animation: none;
	}
</style>
