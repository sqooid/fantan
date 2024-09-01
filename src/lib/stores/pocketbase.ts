import { get, readable, writable } from 'svelte/store';
import PocketBase, { BaseAuthStore } from 'pocketbase';
import { PUBLIC_API_URL } from '$env/static/public';
import type { TypedPocketBase } from '$lib/pocketbase-types';

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
