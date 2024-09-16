import { browser } from '$app/environment';
import { pb } from '$lib/stores/pocketbase';
import type { MetaProps } from '$lib/utils/data-transform';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	if (!browser) {
		let { novelId, novelTitle } = await parent();
		const chapterPattern = /^chapter-(\d+)$/;
		const volumePattern = /^volume-(\d+)$/;
		const volume = params.volume.match(volumePattern)?.[1];
		const chapter = params.chapter.match(chapterPattern)?.[1];

		const { pageMetaTags } = await parent();
		let meta: Partial<MetaProps>;
		try {
			const result = await pb.collection('chapters').getFirstListItem(
				pb.filter('novel = {:novelId} && volume = {:volume} && value = {:chapter}', {
					novelId,
					volume,
					chapter
				}),
				{ fields: 'id,value,volume' }
			);
			meta = {
				...pageMetaTags,
				title: `Fantan | ${novelTitle} | Volume ${result.volume} | Chapter ${result.value}`
			};
		} catch (error) {
			// console.log(error);
			meta = { ...pageMetaTags, title: `Fantan | ${novelTitle} | Chapter not found` };
		}
		return {
			pageMetaTags: Object.freeze(meta)
		};
	}
};
