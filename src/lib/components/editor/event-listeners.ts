import { rootDOMCtx, type Editor } from '@milkdown/kit/core';
import type { Ctx } from '@milkdown/kit/ctx';

type Listeners = {
	onEmptyChange?: (value: boolean) => void;
	onInteraction?: () => void;
};

export const addEventListeners = (editor: Editor, listeners: Listeners) => {
	const root = editor.ctx.get(rootDOMCtx);
	root.addEventListener('keydown', () => {
		listeners.onInteraction?.();
	});
	root.addEventListener('mousedown', () => {
		listeners.onInteraction?.();
	});
	// show/hide placeholder
	root.addEventListener('keydown', () => {
		if (root.innerText === '\n') {
			listeners.onEmptyChange?.(false);
		}
	});
	root.addEventListener('keyup', () => {
		listeners.onEmptyChange?.(root.innerText === '\n');
	});
};
