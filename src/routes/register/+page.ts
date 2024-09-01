import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { authStore } from '$lib/stores/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = (e) => {
	if (get(authStore)?.isValid) {
		redirect(302, '/');
	}
};
