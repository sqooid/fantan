import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const createPersistentStore = <T>(key: string, initialValue: T) => {
	const storedValue = browser ? localStorage.getItem(key) : '';
	const value = storedValue ? JSON.parse(storedValue) : initialValue;
	const { subscribe, set } = writable<T>(value);
	return {
		subscribe,
		set: (value: T) => {
			localStorage.setItem(key, JSON.stringify(value));
			set(value);
		}
	};
};
