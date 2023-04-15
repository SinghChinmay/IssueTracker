import { isUserLoggedIn, user } from './stores';
import { goto } from '$app/navigation';
import axios from 'axios';

export async function loginCheck() {
	try {
		const response = await axios.get('http://localhost:3000/api/v1/profile/me', {
			withCredentials: true // This is important for sending cookies
		});

		if (response.status === 200) {
			isUserLoggedIn.set(true);
			user.set(response.data);
			goto('/profile');
		} else {
			isUserLoggedIn.set(false);
			// also delete the jwt cookie
			document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			goto('/');
		}
	} catch (error) {
		isUserLoggedIn.set(false);
		// also delete the jwt cookie
		document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		goto('/');
	}
}
