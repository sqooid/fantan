import {
	emphasisKeymap,
	emphasisStarInputRule,
	emphasisUnderscoreInputRule,
	paragraphKeymap,
	remarkInlineLinkPlugin,
	schema,
	strongInputRule,
	strongKeymap,
	toggleEmphasisCommand,
	toggleLinkCommand,
	toggleStrongCommand,
	updateLinkCommand
} from '@milkdown/kit/preset/commonmark';

export const commonmarkStripped = [
	schema,

	emphasisStarInputRule,
	emphasisUnderscoreInputRule,
	strongInputRule,
	toggleEmphasisCommand,
	toggleStrongCommand,
	toggleLinkCommand,
	updateLinkCommand,

	paragraphKeymap,
	emphasisKeymap,
	strongKeymap,

	remarkInlineLinkPlugin
].flat();
