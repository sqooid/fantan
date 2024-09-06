import type { Root } from '@milkdown/kit/transformer';
import { $nodeAttr, $nodeSchema, $remark } from '@milkdown/kit/utils';
import { v4 as uuidv4 } from 'uuid';
import type { Text } from 'mdast';
import type { MilkdownPlugin } from '@milkdown/kit/ctx';
import { remarkStringifyOptionsCtx, type Config } from '@milkdown/kit/core';
import type { Handle } from 'mdast-util-to-markdown';

const inlineNoteRegex = /@(\S+?)@\(([a-f0-9-]+)\)/;

const inlineNoteRemark = $remark('inline_note', (ctx) => (tree: Root) => {
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
				value: text
			};
			const beforeText = textNode.value.slice(0, index);
			const afterText = textNode.value.slice(index);
			textNode.value = beforeText;
			const newTextNode = {
				type: 'text',
				value: afterText
			};
			tree.children.splice(index + 1, 0, inlineNoteNode as any, newTextNode as Text);
		}
	}
});

const inlineNoteSerializer: Config = (ctx) => {
	ctx.update(remarkStringifyOptionsCtx, (options) => {
		if (options?.handlers) {
			const handlers = options.handlers as Record<string, Handle>;
			handlers.inlineNote = (node, _, state, info) => {
				const tracker = state.createTracker(info);
				let value = tracker.move(`@${node.value}@(${node.id})`);
				return value;
			};
		}
		return options;
	});
};

export const inlineNoteAttr = $nodeAttr('inlineNote', () => ({
	id: {}
}));

export const inlineNoteSchema = $nodeSchema('inline_note', (ctx) => {
	return {
		content: 'text*',
		group: 'block',
		marks: '',
		defining: true,
		code: true,
		attrs: {
			id: {
				default: ''
			}
		},
		parseDOM: [
			{
				tag: 'span.inline-note',
				preserveWhitespace: true,
				getAttrs: (dom) => {
					return { id: dom.id };
				}
			}
		],
		toDOM: (node) => {
			const attr = ctx.get(inlineNoteAttr.key)(node);
			return [
				'span',
				{
					id: attr.id || uuidv4(),
					class: 'inline-note'
				},
				0
			];
		},
		parseMarkdown: {
			match: ({ type }) => type === 'inline_note',
			runner: (state, node, type) => {
				const id = node.id as string;
				const text = node.text as string;
				state.openNode(type, { id });
				if (text) state.addText(text);

				state.closeNode();
			}
		},
		toMarkdown: {
			match: (node) => node.type.name === 'inline_note',
			runner: (state, node) => {
				state.addNode('inline_note', undefined, node.content.firstChild?.text || '', {
					id: node.attrs.id
				});
			}
		}
	};
});

export const inlineNotePlugin: MilkdownPlugin[] = [
	inlineNoteRemark as any,
	inlineNoteAttr,
	inlineNoteSchema as any
];
