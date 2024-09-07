<script lang="ts">
	import {
		defaultValueCtx,
		Editor,
		editorViewCtx,
		rootCtx,
		rootDOMCtx,
		serializerCtx
	} from '@milkdown/kit/core';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { brackets } from './brackets-plugin';
	import { inlineNotePlugin, inlineNoteRemark, inlineNoteSerializer } from './note-plugin';
	import { debounce } from 'lodash-es';
	import type { Ctx } from '@milkdown/kit/ctx';
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import { Button } from '$lib/shadcn/components/ui/button';
	import InlineNoteEditor from './inline-note-editor.svelte';

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

		const docRoot = ctx.get(rootDOMCtx);
		const notes = docRoot.getElementsByClassName('inline-note');
		for (let index = 0; index < notes.length; index++) {
			const e = notes[index];
			const activated = e.classList.contains('activated');
			if (!activated) {
				e.classList.add('activated');
				e.addEventListener('click', () => {
					editNote(e.id);
				});
			}
		}
	};

	const editNote = (id: string) => {
		dispatch('editNote', { id });
	};

	let milkdownEditor: Editor | null = null;
	let editorDiv: HTMLElement | null = null;
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
			.use(listener)
			.use(brackets)
			.use(inlineNotePlugin)
			.create()
			.then((e) => {
				milkdownEditor = e;
				const ctx = e.ctx;
				onEditorChange(ctx);
				const root = ctx.get(rootDOMCtx);
				root.addEventListener('keydown', () => {
					debounce(() => {
						onEditorChange(ctx);
					}, 100)();
				});
				// show/hide placeholder
				root.addEventListener('keydown', () => {
					if (root.innerText === '\n') {
						showPlaceholder = false;
					}
				});
				root.addEventListener('keyup', () => {
					showPlaceholder = root.innerText === '\n';
				});
			});
	};

	onDestroy(() => {
		milkdownEditor?.destroy();
	});
</script>

<div class="w-full h-full outline-none focus-visible:outline-none">
	<div use:editor class="relative" bind:this={editorDiv}>
		{#if showPlaceholder}
			<span class="absolute text-lg pointer-events-none opacity-30 top-0 left-0">
				{placeholder}...
			</span>
		{/if}
	</div>
</div>
