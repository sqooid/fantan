<script lang="ts">
	import { badgeVariants } from '$lib/shadcn/components/ui/badge';
	import { pb } from '$lib/stores/pocketbase';
	import { searchEmoji } from '$lib/utils/emoji';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { backInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import Starburst from '../effects/starburst.svelte';

	export let emoji: string;
	export let count: number;
	export let active: boolean = false;

	$: loggedIn = pb.authStore?.isValid;

	$: activeClass = active ? 'border-primary/50' : '';

	const dispatch = createEventDispatcher();

	let starburst: Starburst;

	const onClick = () => {
		if (!loggedIn) {
			toast.info('Please log in to react to comments.');
			return;
		}
		if (!active) {
			starburst.showStarburst();
		}
		dispatch('click');
	};
</script>

<button
	class={`cursor-pointer hover:bg-primary/5 h-full ${badgeVariants({ variant: 'outline' })} ${activeClass} focus:ring-0 focus:ring-offset-0`}
	on:click={onClick}
	transition:scale={{ duration: 150, easing: backInOut }}
>
	<span><span class="relative">{emoji}<Starburst bind:this={starburst} /></span> {count} </span>
</button>
