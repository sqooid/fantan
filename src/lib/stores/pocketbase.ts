import { get, readable, writable } from 'svelte/store';
import PocketBase, { BaseAuthStore } from 'pocketbase';
import { PUBLIC_API_URL } from '$env/static/public';

export const pb = readable(new PocketBase(PUBLIC_API_URL));

const createAuthStore = () => {
	const { subscribe, set } = writable<BaseAuthStore | null>(get(pb).authStore);
	get(pb).authStore.onChange((token, model) => {
		const authStore = get(pb).authStore;
		set(authStore);
	});
	return { subscribe };
};
export const authStore = createAuthStore();
