<script lang="ts">
	import {
		defaultValueCtx,
		Editor,
		editorViewCtx,
		rootCtx,
		rootDOMCtx,
		serializerCtx
	} from '@milkdown/kit/core';
	import type { Ctx } from '@milkdown/kit/ctx';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { debounce } from 'lodash-es';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { brackets } from './brackets-plugin';
	import { activateNotes, addEventListeners } from './event-listeners';
	import { inlineNotePlugin, inlineNoteSerializer } from './note-plugin';

	export let content: string;
	export let placeholder = 'English';

	export const getText = () =>
		milkdownEditor?.action((ctx) => {
			const editorView = ctx.get(editorViewCtx);
			const serializer = ctx.get(serializerCtx);
			return serializer(editorView.state.doc);
		});

	const dispatch = createEventDispatcher();

	let showPlaceholder = content.length === 0;
	const onChange = (text: string) => {
		dispatch('input');
		showPlaceholder = text.length === 0;
	};

	let prevContent = content;
	const onEditorChange = (ctx: Ctx) => {
		const editorView = ctx.get(editorViewCtx);
		const serializer = ctx.get(serializerCtx);
		const markdown = serializer(editorView.state.doc);

		if (markdown.length !== prevContent.length || markdown !== prevContent) {
			prevContent = markdown;
			onChange(markdown);
		}

		activateNotes(ctx, editNote);
	};

	const editNote = (id: string) => {
		dispatch('editNote', { id });
	};

	let milkdownEditor: Editor | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				ctx.set(defaultValueCtx, content);
			})
			.config(inlineNoteSerializer)
			.use(commonmark)
			.use(history)
			.use(clipboard)
			.use(brackets)
			.use(inlineNotePlugin)
			.create()
			.then((e) => {
				milkdownEditor = e;
				const ctx = e.ctx;
				onEditorChange(ctx);
				addEventListeners(e, {
					onEmptyChange: (v) => {
						showPlaceholder = v;
					},

					onInteraction: () => {
						debounce(() => {
							onEditorChange(ctx);
						}, 100)();
					}
				});
			});
	};

	onDestroy(() => {
		milkdownEditor?.destroy();
	});
</script>

<div class="w-full h-full outline-none focus-visible:outline-none">
	<div use:editor class="relative">
		{#if showPlaceholder}
			<span class="absolute text-lg pointer-events-none opacity-30 top-0 left-0">
				{placeholder}...
			</span>
		{/if}
	</div>
</div>
