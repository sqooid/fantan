<script lang="ts" context="module">
	export type EnterEvent = { offset: number };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let text: string;
	export let language = 'English';

	let element: HTMLElement;

	const dispatch = createEventDispatcher<{ enter: EnterEvent; input: null; saveSection: null }>();

	let tainted = false;

	const onInput = () => {
		text = element.innerText;
		tainted = true;
		dispatch('input');
	};

	const onFocusOut = () => {
		if (tainted) {
			dispatch('saveSection');
			tainted = false;
		}
	};

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const offset = document.getSelection()?.focusOffset;
			if (offset === undefined) return;

			dispatch('enter', { offset });
		}
	};
</script>

<p
	contenteditable
	class="section-p max-w-prose outline-none font-source-sans-3 text-lg font-light"
	placeholder={language}
	on:input={onInput}
	on:focusout={onFocusOut}
	on:focusin
	bind:this={element}
	on:keypress={onKeyPress}
>
	{text}
</p>

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
