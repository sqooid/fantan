import { browser } from '$app/environment';
import type { MetaProps } from '$lib/utils/data-transform';
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

	const baseMetaTags: MetaProps = {
		description: 'Read unofficial translations of web novels',
		title: 'Fantan',
		url: url.href,
		image: `${url.origin}/fantan.png`,
		imageAlt: 'Fantan logo'
	};

	return {
		url: url.href,
		origin: url.origin,
		path: url.pathname,
		queryClient,
		baseMetaTags: Object.freeze(baseMetaTags)
	};
};
