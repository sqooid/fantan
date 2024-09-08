<script lang="ts">
	import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/kit/core';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { inlineNotePlugin, inlineNoteSerializer } from '../editor/note-plugin';
	import { activateNotes } from '../editor/event-listeners';
	import { createEventDispatcher } from 'svelte';

	export let content: string = '';

	const dispatch = createEventDispatcher<{ openNote: string }>();

	let milkdownEditor: Editor | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				ctx.set(defaultValueCtx, content);
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
				activateNotes(e.ctx, showNote);
			});
	};

	const showNote = (id: string) => {
		dispatch('openNote', id);
	};
</script>

<article class="max-w-prose" use:editor></article>
