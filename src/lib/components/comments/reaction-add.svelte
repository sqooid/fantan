<script lang="ts">
	import { badgeVariants } from '$lib/shadcn/components/ui/badge';
	import * as Popover from '$lib/shadcn/components/ui/popover';
	import { SmileIcon } from 'lucide-svelte';
	import EmojiSearch from './emoji-search.svelte';

	const onClick = () => {
		console.log('clicked');
	};
</script>

<Popover.Root>
	<Popover.Trigger class="h-full">
		<button
			class={`h-full cursor-pointer hover:bg-primary/5 focus:ring-transparent ${badgeVariants({ variant: 'outline' })}`}
			on:click={onClick}
			title="React to this comment"
		>
			<SmileIcon class="w-4 h-4" />
		</button>
	</Popover.Trigger>
	<Popover.Content fitViewport class="">
		<EmojiSearch on:choose />
	</Popover.Content>
</Popover.Root>
