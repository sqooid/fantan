<script lang="ts">
	import {
		defaultValueCtx,
		Editor,
		editorViewCtx,
		rootCtx,
		serializerCtx
	} from '@milkdown/kit/core';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
	import { trailing, trailingConfig } from '@milkdown/kit/plugin/trailing';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { createEventDispatcher, onDestroy } from 'svelte';

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

	let milkdownEditor: Editor | null = null;
	let editorDiv: HTMLElement | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				ctx.set(defaultValueCtx, content);
				const listener = ctx.get(listenerCtx);
				listener.markdownUpdated((ctx, m, pm) => {
					if (m.length !== pm.length || m !== pm) {
						onChange(m);
					}
				});
			})
			.use(commonmark)
			.use(history)
			.use(trailing)
			.use(clipboard)
			.use(listener)
			.create()
			.then((e) => (milkdownEditor = e));
	};

	// override lagg-ass listener to prevent overlap
	const onKeyDown = (e: KeyboardEvent) => {
		if (!showPlaceholder) return;
		const target = e.target as Node;
		if (target && editorDiv?.contains(target)) {
			showPlaceholder = false;
		}
	};

	onDestroy(() => {
		milkdownEditor?.destroy();
	});
</script>

<svelte:document on:keydown={onKeyDown} />

<div class="w-full h-full outline-none focus-visible:outline-none">
	<div use:editor class="relative" bind:this={editorDiv}>
		{#if showPlaceholder}
			<span class="absolute text-lg pointer-events-none opacity-30 top-0 left-0">
				{placeholder}...
			</span>
		{/if}
	</div>
</div>
