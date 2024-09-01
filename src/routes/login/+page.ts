import { authStore } from '$lib/stores/pocketbase';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = (e) => {
	if (get(authStore)?.isValid) {
		redirect(302, '/');
	}
};
