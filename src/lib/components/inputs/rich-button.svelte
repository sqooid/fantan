<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	export let loading = false;
	export let enterClick = false;

	const dispatch = createEventDispatcher();

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && enterClick) {
			dispatch('click');
		}
	};
</script>

<svelte:document on:keypress={onKeyPress} />

<Button class={`btn relative overflow-hidden ${$$props.class ?? ''}`} on:click>
	<slot />
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/50">
			<ProgressRadial width="w-6" />
		</div>
	{/if}
</Button>
