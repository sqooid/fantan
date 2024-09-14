import type { ChaptersResponse } from '$lib/pocketbase-types';

export const chapterToDisplay = (chapter: { value: string; title: string }) =>
	`Chapter ${chapter.value} ${chapter.title ? `- ${chapter.title}` : ''}`;

export const chapterToPath = (chapter: ChaptersResponse, novelSlug: string) =>
	`/read/${novelSlug}/volume-${chapter.volume}/chapter-${chapter.value}`;
