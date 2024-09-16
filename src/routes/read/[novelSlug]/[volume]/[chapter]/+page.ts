import { browser } from '$app/environment';
import { pb } from '$lib/stores/pocketbase';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	if (!browser) {
		let { novelId } = await parent();
		const chapterPattern = /^chapter-(\d+)$/;
		const volumePattern = /^volume-(\d+)$/;
		const volume = params.volume.match(volumePattern)?.[1];
		const chapter = params.chapter.match(chapterPattern)?.[1];
		console.log({ novelId, volume, chapter });

		try {
			const result = await pb.collection('chapters').getFirstListItem(
				pb.filter('novel = {:novelId} && volume = {:volume} && value = {:chapter}', {
					novelId: novelId,
					volume,
					chapter
				}),
				{ fields: 'id,value,volume' }
			);
			console.log(result);

			return {
				chapterId: result.id,
				volume: result.volume,
				chapter: result.value
			};
		} catch (error) {
			console.log('error', error);

			return {};
		}
	}
};
