<script lang="ts">
	import { commonmarkStripped } from '$lib/milkdown/commonmark';
	import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
	import { onDestroy } from 'svelte';
	import { addEventListeners } from '../editor/event-listeners';
	import { emojiPlugin } from './emoji-plugin';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { replaceAll } from '@milkdown/kit/utils';

	export let milkdownEditor: Editor | null = null;
	export let initialContent = '';

	export const getEditor = () => milkdownEditor;
	export const reset = () => {
		milkdownEditor?.action(replaceAll(''));
		showPlaceholder = true;
	};

	let showPlaceholder = true;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				if (initialContent) {
					ctx.set(defaultValueCtx, initialContent);
					showPlaceholder = false;
				}
			})
			.use(commonmarkStripped)
			.use(clipboard)
			.use(history)
			.use(emojiPlugin)
			.create()
			.then((editor) => {
				milkdownEditor = editor;
				addEventListeners(editor, {
					onEmptyChange(value) {
						showPlaceholder = value;
					}
				});
			});
	};
	onDestroy(() => {
		milkdownEditor?.destroy();
	});
</script>

<div class={`milkdown comment ${$$props.class ?? ''}`} use:editor>
	{#if showPlaceholder}
		<div class="absolute pointer-events-none opacity-30 inset-0 flex items-center pl-4">
			<span>Write a comment</span>
		</div>
	{/if}
</div>
