import { expect, test } from 'vitest';
import { parseMdContent, parseMdFootnotes, parseMdStructure } from './transforms';

const testFootnotes = `
[^1]:  Note 1

[^2]:  Note 2

[^3]:  Note 3

[^4]:  Note 3
`;

const testChapter = `Test text with a footnote[^1] and another[^2] and another[^3].`;

const testDocument = String.raw`
# Book 1 \- Test Book

## Chapter 1 \- Test Chapter

${testChapter}

## Chapter 2 \- Another Chapter

Another test chapter with a footnote[^4].

# Book 2 \- Test Book

## Chapter 3 \- Another Chapter

Some random text

${testFootnotes}
`;

test('parseFootNotes', () => {
	const lines = parseMdFootnotes(testFootnotes);
	console.log(lines);

	expect(Object.keys(lines)).lengthOf(4);
});

test('parseContent', () => {
	const lines = parseMdFootnotes(testFootnotes);
	const { content, footnotes } = parseMdContent(testChapter, lines);
	console.log(content);
	console.log(footnotes);

	expect(content).toContain('@1@');
	expect(content).toContain('@2@');
	expect(content).toContain('@3@');
	expect(content).not.toContain('@4@');
});

test('parseStructure', () => {
	const { volumes, footnoteLines } = parseMdStructure(testDocument);
	expect(volumes).lengthOf(2);
	expect(volumes[0].chapters).lengthOf(2);
	expect(volumes[1].chapters).lengthOf(1);
	expect(footnoteLines).lengthOf(4);
});
