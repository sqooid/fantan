<script lang="ts">
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import { BookOpenText, View } from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';

	export let chapterCount: number;
	export let novel: NovelsResponse;

	const md = new MarkdownIt();
	$: descriptionHtml = md.render(novel.description ?? '');
</script>

<div class="flex flex-col gap-4 mt-4">
	<div class="flex flex-wrap gap-12">
		<div class="flex items-center gap-1 small">
			<View class="opacity-50 w-5 h-5" />
			{novel.views} views
		</div>
		<div class="flex items-center gap-1 small">
			<BookOpenText class="opacity-50 w-5 h-5" />
			{chapterCount} chapters
		</div>
	</div>
	{#if descriptionHtml}
		<div class="mt-7 milkdown">
			{@html descriptionHtml}
		</div>
	{:else}
		<p class="p">No description</p>
	{/if}
</div>
