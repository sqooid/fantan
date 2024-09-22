<script lang="ts">
	import { badgeVariants, Badge as button } from '$lib/shadcn/components/ui/badge';
	import { emojiConverter } from '$lib/utils/emoji';
	import { EmojiConvertor } from 'emoji-js';

	export let reaction: string;
	export let count: number;
	$: emoji = emojiConverter.replace_colons(`:${reaction}:`);
</script>

<button
	class={`cursor-pointer hover:bg-primary/5 focus:outline-none ${badgeVariants({ variant: 'outline' })}`}
	on:click
>
	<span> {emoji} {count} </span>
</button>
