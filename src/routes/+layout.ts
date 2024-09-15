import { browser } from '$app/environment';
import { QueryClient } from '@sveltestack/svelte-query';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	return {
		url: url.href,
		origin: url.origin,
		path: url.pathname,
		queryClient
	};
};
