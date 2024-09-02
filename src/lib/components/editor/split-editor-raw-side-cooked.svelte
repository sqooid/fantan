<script lang="ts">
	import { Textarea as div } from '$lib/shadcn/components/ui/textarea';
	import { createEventDispatcher } from 'svelte';

	export let content: string;
	export let placeholder = 'English';

	export const getText = () => elem.innerText;

	const onPaste = (e: ClipboardEvent) => {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') ?? '';
		document.execCommand('insertHTML', false, text);
	};

	// const dispatch = createEventDispatcher();
	// const onInput = () => {
	// 	content = elem.innerText;
	// 	dispatch('input');
	// };

	let elem: HTMLElement;
</script>

<div class="w-full">
	<div
		bind:this={elem}
		contenteditable
		class="mx-auto section-p max-w-prose w-full outline-none font-source-sans-3 text-lg font-light"
		{placeholder}
		on:paste={onPaste}
		on:input
	>
		{content}
	</div>
</div>

<style lang="postcss">
	.section-p:empty:before {
		content: attr(placeholder);
		opacity: 0.2;
		pointer-events: none;
	}
	.section-p:empty:before:focus {
		@apply outline-none;
	}
</style>
