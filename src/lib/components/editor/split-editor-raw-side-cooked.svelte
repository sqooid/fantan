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
	import { trailing } from '@milkdown/kit/plugin/trailing';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { createEventDispatcher } from 'svelte';

	export let content: string;
	export let placeholder = 'English';

	export const getText = () =>
		mEditor?.action((ctx) => {
			const editorView = ctx.get(editorViewCtx);
			const serializer = ctx.get(serializerCtx);
			return serializer(editorView.state.doc);
		});

	const dispatch = createEventDispatcher();

	let mEditor: Editor | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				ctx.set(defaultValueCtx, content);
				const listener = ctx.get(listenerCtx);
				listener.markdownUpdated((ctx, m, pm) => {
					if (m !== pm) {
						dispatch('input');
					}
				});
			})
			.use(commonmark)
			.use(history)
			.use(trailing)
			.use(clipboard)
			.use(listener)
			.create()
			.then((e) => (mEditor = e));
	};

	// const dispatch = createEventDispatcher();
	// const onInput = () => {
	// 	content = elem.innerText;
	// 	dispatch('input');
	// };
</script>

<div class="w-full h-full outline-none focus-visible:outline-none">
	<div use:editor />
</div>
