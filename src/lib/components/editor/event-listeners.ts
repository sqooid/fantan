import { editorViewCtx, rootDOMCtx, serializerCtx, type Editor } from '@milkdown/kit/core';
import type { Ctx } from '@milkdown/kit/ctx';

type Listeners = {
	onEmptyChange?: (value: boolean) => void;
	onInteraction?: () => void;
};

export const addEventListeners = (editor: Editor, listeners: Listeners) => {
	const root = editor.ctx.get(rootDOMCtx);
	listeners.onInteraction &&
		root.addEventListener('keydown', (e) => {
			if (!['Shift', 'Control', 'Alt'].includes(e.key)) {
				listeners.onInteraction?.();
			}
		});
	listeners.onInteraction &&
		root.addEventListener('mousedown', () => {
			listeners.onInteraction?.();
		});
	// show/hide placeholder
	listeners.onEmptyChange &&
		root.addEventListener('keydown', (e) => {
			if (root.innerText === '\n' && !['Shift', 'Control', 'Alt', 'Backspace'].includes(e.key)) {
				listeners.onEmptyChange?.(false);
			}
		});
	listeners.onEmptyChange &&
		root.addEventListener('keyup', () => {
			listeners.onEmptyChange?.(root.innerText === '\n');
		});
};

export const renderMilkdown = (editor: Editor) => {
	const ctx = editor.ctx;
	const editorView = ctx.get(editorViewCtx);
	const serializer = ctx.get(serializerCtx);
	const markdown = serializer(editorView.state.doc);
	return markdown;
};
