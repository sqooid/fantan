import { v4 as uuid } from 'uuid';

export const parseMdFootnotes = (content: string | string[]): Record<string, string> => {
	const numberPattern = /\[\^(\d+)\]:\s*(.+)/;
	const splitContent = Array.isArray(content) ? content : content.split('\n');
	const lines = splitContent.reduce(
		(acc, line) => {
			if (!line) return acc;
			const match = line.match(numberPattern);
			if (match) {
				acc[match[1]] = match[2];
			}
			return acc;
		},
		{} as Record<string, string>
	);
	return lines;
};

export const parseMdContent = (
	content: string,
	footnotes: Record<string, string>
): { content: string; footnotes: Record<string, string> } => {
	const footnotePattern = /\[\^(\d+)\]/g;
	const usedNotes: Record<string, string> = {};
	const newContent = content.replaceAll(footnotePattern, (match, id) => {
		const noteId = uuid();
		if (!footnotes[id]) return match;

		usedNotes[noteId] = footnotes[id];
		return `@${id}@(${noteId})`;
	});
	return { content: newContent, footnotes: usedNotes };
};

export const defaultParseMdStructureOptions = {
	volumeRegex: String.raw`# Book (\d+).*`,
	chapterRegex: String.raw`## Chapter (\d+) \\- (.+)`
};

type Chapter = {
	title: string;
	value: string;
	lines: string[];
};
type Volume = {
	value: string;
	chapters: Chapter[];
};
export const parseMdStructure = (content: string, options = defaultParseMdStructureOptions) => {
	options = { ...defaultParseMdStructureOptions, ...options };
	const volumeRegex = new RegExp(options.volumeRegex);
	const chapterRegex = new RegExp(options.chapterRegex);
	const footnotesStartRegex = /^\[\^\d+\]/;

	const lines = content.split('\n');
	const volumes: Volume[] = [];

	let currentVolume: Volume | null = null;
	let currentChapter: Chapter | null = null;
	let footnoteLines: string[] = [];

	lines.forEach((line) => {
		const volumeMatch = line.match(volumeRegex);
		if (volumeMatch) {
			currentVolume = {
				value: volumeMatch[1],
				chapters: []
			};
			volumes.push(currentVolume);
			return;
		}
		const chapterMatch = line.match(chapterRegex);
		if (chapterMatch) {
			currentChapter = {
				title: chapterMatch[2],
				value: chapterMatch[1],
				lines: []
			};
			currentVolume?.chapters.push(currentChapter);
			return;
		}
		if (footnotesStartRegex.test(line) || footnoteLines.length) {
			footnoteLines.push(line);
			return;
		}
		currentChapter?.lines.push(line);
	});

	return { volumes, footnoteLines: footnoteLines.filter(Boolean) };
};
