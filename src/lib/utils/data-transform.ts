import type { ChaptersResponse } from '$lib/pocketbase-types';
import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const chapterToDisplay = (chapter: { value: string; title: string }) =>
	`Chapter ${chapter.value} ${chapter.title ? `- ${chapter.title}` : ''}`;

export const chapterToPath = (chapter: ChaptersResponse, novelSlug: string) =>
	`/read/${novelSlug}/volume-${chapter.volume}/chapter-${chapter.value}`;

export const markdownText = (text?: string) => {
	let descriptionText = '';
	const md = new MarkdownIt().use(plainText);
	md.render(text ?? '');
	//@ts-ignore
	return md.plainText;
};

export type MetaProps = {
	title: string;
	description: string;
	image: string;
	imageAlt: string;
	url: string;
};
export const generateMetaProps = (props: MetaProps): MetaTagsProps => {
	return {
		title: props.title,
		description: props.description,
		canonical: props.url,
		openGraph: {
			type: 'website',
			url: props.url,
			locale: 'en_US',
			title: props.title,
			description: props.description,
			siteName: 'Fantan',
			images: [
				{
					url: props.image,
					alt: props.imageAlt
				}
			]
		},
		twitter: {
			cardType: 'summary_large_image',
			title: props.title,
			description: props.description,
			image: props.image,
			imageAlt: props.imageAlt
		}
	};
};
