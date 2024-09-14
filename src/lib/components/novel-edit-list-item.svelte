<script lang="ts">
	import { browser } from '$app/environment';
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import CardContent from '$lib/shadcn/components/ui/card/card-content.svelte';
	import CardTitle from '$lib/shadcn/components/ui/card/card-title.svelte';
	import Card from '$lib/shadcn/components/ui/card/card.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { BookText } from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';
	import plainText from 'markdown-it-plain-text';

	export let novel: NovelsResponse;
	export let edit = true;

	const md = new MarkdownIt().use(plainText);
	let description = '';
	$: if (browser) {
		md.render(novel.description);
		//@ts-ignore
		description = md.plainText;
	}
</script>

<Card>
	<a href={edit ? `/edit/${novel.id}` : `/read/${novel.slug}`}>
		<CardContent class="p-3 sm:p-6 flex flex-col gap-4 w-full">
			{#if novel.cover}
				<img
					src={pb.files.getUrl(novel, novel.cover)}
					alt={`${novel.title} cover image`}
					class="h-48 rounded-lg w-full max-w-full self-center object-cover"
				/>
			{:else}
				<div class="w-fit max-w-full self-center">
					<BookText class="h-48 w-16" />
				</div>
			{/if}
			<CardTitle>
				{novel.title}
			</CardTitle>
			<div class="flex flex-col justify-between h-full gap-4">
				<small class="opacity-50 small overflow-ellipsis line-clamp-4">
					{description || 'No description'}
				</small>
				<p class="muted">
					{novel.chaptersCount} chapters
				</p>
			</div>
		</CardContent>
	</a>
</Card>
