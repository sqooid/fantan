import { get } from 'svelte/store';
import type { LayoutData } from './$types';
import { authStore } from '$lib/stores/pocketbase';
import { goto } from '$app/navigation';

export const load: LayoutData = () => {
	// protected route
	if (!get(authStore)?.isValid) {
		goto('/login');
	}
};
