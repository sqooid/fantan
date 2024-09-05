import { browser } from '$app/environment';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { authStore } from '$lib/stores/pocketbase';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load: LayoutLoad = (e) => {
	if (browser) {
		if (!get(authStore)?.isValid) {
			redirect(302, '/login');
		}
	}
};
