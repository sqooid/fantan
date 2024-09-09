export const chapterToDisplay = (chapter: { value: string; title: string }) =>
	`Chapter ${chapter.value} ${chapter.title ? `- ${chapter.title}` : ''}`;
