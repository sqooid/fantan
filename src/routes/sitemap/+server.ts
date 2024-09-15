import { pb } from '$lib/stores/pocketbase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (request) => {
	const origin = request.url.origin;
	console.log(origin);

	const novels = await pb
		.collection('novels')
		.getFullList({ filter: pb.filter('chaptersCount > 0'), fields: 'slug,id,updated' });
	const novelsMap = novels.reduce(
		(acc, novel) => {
			acc[novel.id] = novel.slug;
			return acc;
		},
		{} as Record<string, string>
	);
	const chapters = await pb
		.collection('chapters')
		.getFullList({ filter: pb.filter('published = true'), fields: 'novel,volume,value,updated' });
	const urls = novels
		.map(
			(novel) =>
				`<url><loc>${origin}/read/${novel.slug}</loc><lastmod>${new Date(novel.updated).toISOString()}</lastmod></url>`
		)

		.concat(
			chapters.map((chapter) => {
				const novelSlug = novelsMap[chapter.novel];
				return `<url><loc>${origin}/read/${novelSlug}/volume-${chapter.volume}/chapter-${chapter.value}</loc><lastmod>${new Date(chapter.updated).toISOString()}</lastmod></url>`;
			})
		);
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
		${urls.join('\n')}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
};
