<script lang="ts">
	import { badgeVariants } from '$lib/shadcn/components/ui/badge';
	import { emojiConverter } from '$lib/utils/emoji';

	export let reaction: string;
	export let count: number;
	export let active: boolean = false;

	$: emoji = emojiConverter.replace_colons(`:${reaction}:`);
	$: activeClass = active ? 'border-primary/50' : '';
</script>

<button
	class={`cursor-pointer hover:bg-primary/5 focus:ring-transparent ${badgeVariants({ variant: 'outline' })} ${activeClass}`}
	on:click
>
	<span> {emoji} {count} </span>
</button>
