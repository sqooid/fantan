<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/shadcn/utils.js';
	import { createEventDispatcher } from 'svelte';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
	export let autoEnter = false;

	const dispatch = createEventDispatcher();
	const onKeyPress = (e: KeyboardEvent) => {
		if (autoEnter && e.key === 'Enter') {
			e.preventDefault();
			//@ts-ignore
			dispatch('click');
		}
	};
</script>

<svelte:document on:keypress={onKeyPress} />

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
