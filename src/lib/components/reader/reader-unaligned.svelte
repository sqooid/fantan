<script lang="ts">
	import { Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/kit/core';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { replaceAll } from '@milkdown/kit/utils';
	import { createEventDispatcher } from 'svelte';
	import { activateNotes } from '../editor/event-listeners';
	import { inlineNotePlugin, inlineNoteSerializer } from '../editor/note-plugin';

	export let content: string = '';

	const dispatch = createEventDispatcher<{ openNote: string }>();

	let milkdownEditor: Editor | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					editable: () => false
				}));
			})
			.config(inlineNoteSerializer)
			.use(commonmark)
			.use(inlineNotePlugin)
			.create()
			.then((e) => {
				milkdownEditor = e;
			});
	};

	$: if (content && milkdownEditor) {
		milkdownEditor.action(replaceAll(content));
		activateNotes(milkdownEditor.ctx, showNote);
	}

	const showNote = (id: string) => {
		dispatch('openNote', id);
	};
</script>

<article class="max-w-prose" use:editor></article>
