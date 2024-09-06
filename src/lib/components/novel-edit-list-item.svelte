<script lang="ts">
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import CardContent from '$lib/shadcn/components/ui/card/card-content.svelte';
	import CardTitle from '$lib/shadcn/components/ui/card/card-title.svelte';
	import Card from '$lib/shadcn/components/ui/card/card.svelte';
	import { pb } from '$lib/stores/pocketbase';

	export let novel: NovelsResponse;
	export let edit = true;
</script>

<Card>
	<a href={`/${edit ? 'edit/' : ''}novels/${novel.id}`}>
		<CardContent class="p-6 flex flex-col gap-4 w-64 h-full">
			<img
				src={pb.files.getUrl(novel, novel.cover)}
				alt={`${novel.title} cover image`}
				class="h-48 rounded-lg w-fit max-w-full self-center"
			/>
			<CardTitle>
				{novel.title}
			</CardTitle>
			<div class="flex flex-col justify-between h-full gap-4">
				<small class="opacity-50 text-sm font-medium leading-none overflow-ellipsis line-clamp-4">
					{novel.description || 'No description'}
				</small>
				<p class="text-muted-foreground text-sm">
					{novel.chaptersCount} chapters
				</p>
			</div>
		</CardContent>
	</a>
</Card>
