<script lang="ts">
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import CardContent from '$lib/shadcn/components/ui/card/card-content.svelte';
	import CardTitle from '$lib/shadcn/components/ui/card/card-title.svelte';
	import Card from '$lib/shadcn/components/ui/card/card.svelte';
	import { pb } from '$lib/stores/pocketbase';

	export let novel: NovelsResponse;
</script>

<Card>
	<a href={`/edit/novels/${novel.id}`}>
		<CardContent class="p-6 flex flex-col gap-4">
			<img
				src={pb.files.getUrl(novel, novel.cover)}
				alt={`${novel.title} cover image`}
				class="h-48 rounded-lg w-fit self-center"
			/>
			<CardTitle>
				{novel.title}
			</CardTitle>
			<span class="opacity-50">{novel.description || 'No description'}</span>
		</CardContent>
	</a>
</Card>
