import { writable } from 'svelte/store';

const notificationStore = writable({
	message: '',
	type: 'success',
	duration: 3000
});

export function notify(message: any, type = 'success', duration: number | undefined = undefined) {
	notificationStore.set({ message, type, duration: duration || message.split(' ').length * 1000 });
}

export default notificationStore;
