import { writable } from 'svelte/store';

export const isUserLoggedIn = writable(false);
export const user: any = writable({});
