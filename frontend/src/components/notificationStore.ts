import { writable } from 'svelte/store';

const notificationStore = writable({
	message: '',
	type: 'success',
	duration: 3000
});

export function notify(message: any, type = 'success', duration = 3000) {
	notificationStore.set({ message, type, duration });
}

$: console.log('notificationStore', notificationStore);

export default notificationStore;
