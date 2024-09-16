import { browser } from '$app/environment';
import { pb } from '$lib/stores/pocketbase';
import { markdownText, type MetaProps } from '$lib/utils/data-transform';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, url }) => {
	if (!browser) {
		const novelSlug = params.novelSlug;
		let meta: Partial<MetaProps>;
		let novelId: string | undefined;
		let novelTitle: string | undefined;
		try {
			const novel = await pb
				.collection('novels')
				.getFirstListItem(pb.filter('slug = {:slug}', { slug: novelSlug }), {
					fields: 'id,title,description,originalAuthor,cover,collectionId'
				});
			novelId = novel.id;
			novelTitle = novel.title;
			meta = {
				title: `Fantan | ${novel.title}`,
				description: markdownText(novel.description),
				image: pb.files.getUrl(novel, novel.cover),
				imageAlt: `Cover image of ${novel.title}`
			};
		} catch (error) {
			meta = {
				title: 'Fantan | Novel not found',
				description: 'Read unofficial translations of web novels'
			};
		}
		return {
			novelId,
			novelTitle,
			pageMetaTags: Object.freeze(meta)
		};
	}
};
