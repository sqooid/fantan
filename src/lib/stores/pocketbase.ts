import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import type { TypedPocketBase } from '$lib/pocketbase-types';
import PocketBase, { BaseAuthStore } from 'pocketbase';
import { get, writable } from 'svelte/store';
import { createPersistentStore } from './base';

export const pb = new PocketBase(PUBLIC_API_URL) as TypedPocketBase;

const createAuthStore = () => {
	const { subscribe, set } = writable<BaseAuthStore | null>(pb.authStore);
	pb.authStore.onChange((token, model) => {
		const authStore = pb.authStore;
		set(authStore);
	});
	return { subscribe };
};
export const authStore = createAuthStore();

export const logOut = () => {
	get(authStore)?.clear();
	goto('/login');
};

export const turnstileJwt = createPersistentStore('turnstileJwt', '');
export const turnstileToken = writable('');
