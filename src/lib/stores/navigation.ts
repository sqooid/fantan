import { writable } from 'svelte/store';

type Breadcrumb = {
	title: string;
	href: string;
};

export const breadcrumbStore = writable<Breadcrumb[]>([]);
