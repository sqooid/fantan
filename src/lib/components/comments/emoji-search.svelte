<script lang="ts">
	import { Input } from '$lib/shadcn/components/ui/input';
	import { searchEmoji } from '$lib/utils/emoji';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let search = '';

	$: emojiList = searchEmoji(search);

	const onClick = (emoji: string) => {
		search = '';
		dispatch('choose', emoji);
	};
</script>

<div class="h-fit">
	<Input type="text" placeholder="Search..." bind:value={search} class="top-0" />
	<div class="overflow-y-auto h-72 max-h-[50vh] mt-2">
		<div class="grid grid-cols-8">
			{#each emojiList as em}
				<button class="hover:bg-primary/5 rounded-sm p-[1px]" on:click={() => onClick(em)}
					>{em}</button
				>
			{/each}
		</div>
	</div>
</div>
