import MarkdownIt from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji';

export const commentMd = new MarkdownIt({ linkify: true })
	.use(emoji)
	.disable(['heading', 'html_inline', 'blockquote']);
