import { get } from 'svelte/store';
import type { LayoutData } from './$types';
import { authStore } from '$lib/stores/pocketbase';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

export const load: LayoutData = () => {
	// protected route
	if (!get(authStore)?.isValid) {
		redirect(302, '/login');
	}
};
