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

export const activateNotes = (ctx: Ctx, onClick: (id: string) => void) => {
	const docRoot = ctx.get(rootDOMCtx);
	const notes = docRoot.getElementsByClassName('inline-note');
	for (let index = 0; index < notes.length; index++) {
		const e = notes[index];
		const activated = e.classList.contains('activated');
		if (!activated) {
			e.classList.add('activated');
			e.addEventListener('click', () => {
				onClick(e.id);
			});
		}
	}
};
