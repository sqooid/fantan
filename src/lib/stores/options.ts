import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { isMobile } from './breakpoints';
import type { NovelsSourceLanguageOptions } from '$lib/pocketbase-types';

const defaultReaderOptions = {
	aligned: true,
	showSource: !get(isMobile),
	font: {
		中文: 'Noto Sans',
		日本語: 'Noto Sans',
		Other: 'Noto Sans',
		English: 'Noto Sans'
	}
};

export enum TranslatedLanguageOptions {
	'English' = 'English'
}

export type LanguagesFonts<T> = { [K in keyof T]: Record<string, string> };

export const fontOptions: LanguagesFonts<typeof NovelsSourceLanguageOptions> &
	LanguagesFonts<typeof TranslatedLanguageOptions> = {
	中文: {
		'Noto Sans': 'Noto Sans SC',
		'Noto Serif': 'Noto Serif SC'
	},
	日本語: {
		'Noto Sans': 'Noto Sans JP',
		'Noto Serif': 'Noto Serif JP'
	},
	Other: {
		'Noto Sans': 'Noto Sans',
		'Noto Serif': 'Noto Serif'
	},
	English: {
		'Noto Sans': 'Noto Sans',
		'Noto Serif': 'Noto Serif'
	}
};

export type Languages = keyof typeof fontOptions;

export type ReaderOptions = typeof defaultReaderOptions;

const createReaderOptionStore = (key: string) => {
	const existing = browser ? localStorage.getItem(key) : null;
	const options: ReaderOptions = existing
		? JSON.parse(existing)
		: { aligned: true, showSource: !get(isMobile) };

	const { subscribe, set } = writable<ReaderOptions>({ ...defaultReaderOptions, ...options });

	const persistentSet = (value: ReaderOptions) => {
		localStorage.setItem('readerOptions', JSON.stringify(value));
		set(value);
	};
	return { subscribe, set: persistentSet };
};

export const readerOptions = createReaderOptionStore('readerOptions');
export const editorOptions = createReaderOptionStore('editorOptions');

export type ReaderInfo = {
	language: {
		source: Languages;
		translated: Languages;
	};
};

export const readerInfo = writable<ReaderInfo>({
	language: {
		source: 'Other',
		translated: 'English'
	}
});
