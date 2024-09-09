import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { isMobile } from './breakpoints';

export type ReaderOptions = {
	aligned: boolean;
	showSource: boolean;
};

const createReaderOptionStore = () => {
	const existing = browser ? localStorage.getItem('readerOptions') : null;
	const options: ReaderOptions = existing
		? JSON.parse(existing)
		: { aligned: true, showSource: !get(isMobile) };
	const { subscribe, set } = writable<ReaderOptions>(options);
	const persistentSet = (value: ReaderOptions) => {
		localStorage.setItem('readerOptions', JSON.stringify(value));
		set(value);
	};
	return { subscribe, set: persistentSet };
};

export const readerOptions = createReaderOptionStore();
