import { convertEmoji } from '$lib/utils/emoji';
import { schemaCtx } from '@milkdown/kit/core';
import { InputRule } from '@milkdown/kit/prose/inputrules';
import { $inputRule } from '@milkdown/kit/utils';

export const insertEmojiInputRule = $inputRule(
	(ctx) =>
		new InputRule(/(:([^:\s]+):)$/, (state, match, start, end) => {
			const content = match[0];
			if (!content) return null;
			const output = convertEmoji(content);
			if (!output) return null;
			return state.tr.replaceRangeWith(start, end, ctx.get(schemaCtx).text(output));
		})
);

export const emojiPlugin = [insertEmojiInputRule];
