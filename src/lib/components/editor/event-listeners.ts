import { rootDOMCtx, type Editor } from '@milkdown/kit/core';

type Listeners = {
	onEmptyChange?: (value: boolean) => void;
	onKeyDown?: () => void;
};

export const addEventListeners = (editor: Editor, listeners: Listeners) => {
	const root = editor.ctx.get(rootDOMCtx);
	root.addEventListener('keydown', () => {
		listeners.onKeyDown?.();
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
