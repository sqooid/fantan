import { remarkStringifyOptionsCtx, type Config } from '@milkdown/kit/core';
import { createSlice, type MilkdownPlugin } from '@milkdown/kit/ctx';
import { markRule } from '@milkdown/kit/prose';
import type { Root } from '@milkdown/kit/transformer';
import { $inputRule, $markAttr, $markSchema, $remark } from '@milkdown/kit/utils';
import type { Parent, Text } from 'mdast';
import type { Handle } from 'mdast-util-to-markdown';
import { v4 as uuidv4 } from 'uuid';

const inlineNoteRegex = /@(\S+?)@\(([a-f0-9-]+)\)/;

export const inlineNoteRemark = $remark('inlineNote', () => () => {
	const transform = (tree: Parent) => {
		if (!tree.children) return;
		for (let index = 0; index < tree.children.length; index++) {
			const node = tree.children[index];
			if (node.type === 'text') {
				const textNode = node as Text;
				const match = inlineNoteRegex.exec(textNode.value);
				if (!match) continue;
				const index = match.index;
				const length = match[0].length;
				const text = match[1];
				const id = match[2];
				const inlineNoteNode = {
					type: 'inline_note',
					id,
					children: [{ type: 'text', value: text }]
				};
				const beforeText = textNode.value.slice(0, index);
				const afterText = textNode.value.slice(index + length);
				console.log({ beforeText, afterText });

				textNode.value = beforeText;
				const newTextNode = {
					type: 'text',
					value: afterText
				};

				const deletePrior = beforeText.length === 0;

				if (afterText.length === 0) {
					tree.children.splice(
						deletePrior ? index : index + 1,
						deletePrior ? 1 : 0,
						inlineNoteNode as any
					);
				} else {
					tree.children.splice(
						deletePrior ? index : index + 1,
						deletePrior ? 1 : 0,
						inlineNoteNode as any,
						newTextNode as Text
					);
				}
			} else if ('children' in node) {
				transform(node as Parent);
			}
		}
	};
	return transform;
});

export const inlineNoteSerializer: Config = (ctx) => {
	ctx.update(remarkStringifyOptionsCtx, (options) => {
		if (options?.handlers) {
			const handlers = options.handlers as Record<string, Handle>;
			handlers.inlineNote = (node, _, state, info) => {
				const tracker = state.createTracker(info);
				let value = tracker.move(`@`);
				value += tracker.move(state.containerFlow(node, tracker.current()));
				value += tracker.move(`@(${node.id})`);

				return value;
			};
		}
		return options;
	});
};

export const inlineNoteAttr = $markAttr('inline_note', () => ({
	id: ''
}));

export const inlineNoteSchema = $markSchema('inline_note', (ctx) => {
	return {
		spanning: false,
		attrs: {
			id: {
				default: ''
			}
		},
		parseDOM: [
			{
				tag: 'sup.inline-note',
				preserveWhitespace: true,
				getAttrs: (dom) => {
					return { id: dom.id };
				}
			}
		],
		toDOM: (mark) => {
			const attr = ctx.get(inlineNoteAttr.key)(mark);
			const callback = ctx.get(noteCallbackCtx);
			const id = mark.attrs.id || uuidv4();

			const dom = document.createElement('sup');
			dom.id = id;
			dom.addEventListener('click', () => callback(id));
			dom.classList.add('inline-note', 'activated');

			return { dom };
		},
		parseMarkdown: {
			match: ({ type }) => type === 'inline_note',
			runner: (state, node, type) => {
				const id = node.id as string;
				state.openMark(type, { id });
				state.next(node.children);
				state.closeMark(type);
			}
		},
		toMarkdown: {
			match: (mark) => mark.type.name === 'inline_note',
			runner: (state, mark) => {
				state.withMark(mark, 'inlineNote', undefined, {
					id: mark.attrs.id
				});
			}
		}
	};
});

const inlineNoteInputRule = $inputRule((ctx) => {
	return markRule(/@(\S+)@$/, inlineNoteSchema.type(ctx), {
		getAttr: (match) => {
			return {
				id: uuidv4()
			};
		}
	});
});

export const inlineNotePlugin: MilkdownPlugin[] = [
	inlineNoteRemark as any,
	inlineNoteAttr,
	inlineNoteSchema as any,
	inlineNoteInputRule
];

export const noteCallbackCtx = createSlice((id: string) => {}, 'noteCallback');
