<script lang="ts">
	import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/kit/core';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { createEventDispatcher } from 'svelte';
	import { inlineNotePlugin, inlineNoteSerializer, noteCallbackCtx } from '../editor/note-plugin';

	export let sourceContent: string;
	export let translatedContent: string;

	const dispatch = createEventDispatcher<{ openNote: string }>();

	const showNote = (id: string) => {
		dispatch('openNote', id);
	};

	const render = async (content: string) => {
		const root = document.createElement('div');
		const editor = await Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root);
				ctx.set(defaultValueCtx, content);
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					editable: () => false
				}));
				ctx.inject(noteCallbackCtx, showNote);
			})
			.config(inlineNoteSerializer)
			.use(commonmark)
			.use(inlineNotePlugin)
			.create();
		const nodes = root.firstChild?.firstChild?.childNodes;
		return nodes;
	};

	const transformNodes = async (e: HTMLElement) => {
		root.innerHTML = '';
		const sourceNodes = await render(sourceContent);
		const translatedNodes = await render(translatedContent);

		if (!sourceNodes || !translatedNodes) return;
		while (sourceNodes.length || translatedNodes.length) {
			let sourceNode = (sourceNodes[0] ?? document.createElement('div')) as HTMLElement;
			sourceNode.classList.add('font-source');
			e.appendChild(sourceNode);
			let translatedNode = (translatedNodes[0] ?? document.createElement('div')) as HTMLElement;
			translatedNode.classList.add('font-translated');
			e.appendChild(translatedNode);
		}
	};

	let root: HTMLElement;
	$: if (root && (sourceContent || translatedContent || true)) transformNodes(root);
</script>

<div class="w-full">
	<div
		class="aligned-reader grid grid-cols-[minmax(auto,65ch)_minmax(auto,65ch)] gap-x-8 lg:gap-x-24 w-fit mx-auto milkdown"
		bind:this={root}
	/>
</div>
