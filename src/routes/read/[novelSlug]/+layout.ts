import { browser } from '$app/environment';
import { pb } from '$lib/stores/pocketbase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, url }) => {
	if (!browser) {
		const novelSlug = params.novelSlug;
		try {
			const novelSlugResult = await pb
				.collection('novels')
				.getFirstListItem(pb.filter('slug = {:slug}', { slug: novelSlug }), {
					fields: 'id,title,description,originalAuthor,cover,collectionId'
				});
			return {
				novelId: novelSlugResult.id,
				novelTitle: novelSlugResult.title,
				description: novelSlugResult.description,
				author: novelSlugResult.originalAuthor,
				url: url.href,
				cover: pb.files.getUrl(novelSlugResult, novelSlugResult.cover)
			};
		} catch (error) {}
	}
};
