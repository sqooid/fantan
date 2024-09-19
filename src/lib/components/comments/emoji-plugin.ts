import { schemaCtx } from '@milkdown/kit/core';
import { InputRule } from '@milkdown/kit/prose/inputrules';
import { $inputRule } from '@milkdown/kit/utils';
import EmojiConvertor from 'emoji-js';

const emoji = new EmojiConvertor();
emoji.replace_mode = 'unified';

export const insertEmojiInputRule = $inputRule(
	(ctx) =>
		new InputRule(/(:([^:\s]+):)$/, (state, match, start, end) => {
			const content = match[0];
			if (!content) return null;
			const output = emoji.replace_colons(content);
			if (!output) return null;
			return state.tr.replaceRangeWith(start, end, ctx.get(schemaCtx).text(output));
		})
);

export const emojiPlugin = [insertEmojiInputRule];
