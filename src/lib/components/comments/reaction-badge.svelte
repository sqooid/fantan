<script lang="ts">
	import { badgeVariants } from '$lib/shadcn/components/ui/badge';
	import { emojiConverter } from '$lib/utils/emoji';
	import { createEventDispatcher } from 'svelte';
	import Starburst from '../effects/starburst.svelte';

	export let reaction: string;
	export let count: number;
	export let active: boolean = false;

	$: emoji = emojiConverter.replace_colons(`:${reaction}:`);
	$: activeClass = active ? 'border-primary/50' : '';

	const dispatch = createEventDispatcher();

	let starburst: Starburst;

	const onClick = () => {
		if (!active) {
			starburst.showStarburst();
		}
		dispatch('click');
	};
</script>

<button
	class={`cursor-pointer hover:bg-primary/5 focus:ring-transparent ${badgeVariants({ variant: 'outline' })} ${activeClass}`}
	on:click={onClick}
>
	<span><span class="relative">{emoji}<Starburst bind:this={starburst} /></span> {count} </span>
</button>
