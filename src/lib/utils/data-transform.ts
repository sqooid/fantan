import type { ChaptersResponse } from '$lib/pocketbase-types';
import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';

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
