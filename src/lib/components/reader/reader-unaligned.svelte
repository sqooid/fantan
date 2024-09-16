<script lang="ts">
	import { Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/kit/core';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { replaceAll } from '@milkdown/kit/utils';
	import { createEventDispatcher } from 'svelte';
	import { inlineNotePlugin, inlineNoteSerializer, noteCallbackCtx } from '../editor/note-plugin';

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
				ctx.inject(noteCallbackCtx, showNote);
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
	}

	const showNote = (id: string) => {
		dispatch('openNote', id);
	};
</script>

<article class={`max-w-prose ${$$props.class ?? ''}`} use:editor></article>
