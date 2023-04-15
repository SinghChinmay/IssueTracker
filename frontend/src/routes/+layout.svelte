<script>
	import Header from './Header.svelte';
	import './styles.css';
	import Notification from '../components/Notification.svelte';
	import { onMount } from 'svelte';
	import { loginCheck } from '$lib/loginCheck';

	onMount(async () => {
		await loginCheck();
	});
</script>

<div class="app">
	<Header />

	<main>
		<Notification />
		<slot />
	</main>

	<footer>
		<div class="footer-container">
			<div class="footer-logo">
				<a href="/"><h3>Issue Tracker</h3></a>
			</div>
			<div class="footer-links">
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
				<a href="/privacy">Privacy Policy</a>
			</div>
		</div>
	</footer>

	<style>
		footer {
			width: 100%;
			background-color: #4caf50;
			box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
			padding: 1rem 0;
		}

		.footer-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			max-width: 1024px;
			margin: 0 auto;
			padding: 0 1rem;
		}

		.footer-logo h3 {
			color: white;
			margin: 0;
		}

		.footer-links a {
			color: white;
			text-decoration: none;
			margin-left: 1rem;
			transition: color 0.3s;
		}

		.footer-links a:hover {
			color: #f5f5f5;
		}
	</style>
</div>
