<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import Reader from '$lib/components/reader/reader.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';

	const chapterId = $page.params.slug;

	let editor: SplitEditor;

	const chapterQuery = useQuery(['chapter', chapterId], async () => {
		const result = await pb.collection('chapters').getOne(chapterId, { expand: 'novel' });
		return result;
	});

	$: data = $chapterQuery.data;
	$: chapterContent = data?.content as ChapterSection | null;
	$: notes = (data?.notes ?? {}) as Record<string, string>;
</script>

<div class="flex flex-col w-full gap-4">
	{#if data}
		<h1 class="max-w-prose mx-auto">Chapter {data.value}{data.title ? ` - ${data.title}` : ''}</h1>
	{/if}
	{#if chapterContent}
		<div class="p-8 mt-24">
			<Reader
				sourceContent={chapterContent.source}
				translatedContent={chapterContent.translated}
				{notes}
			/>
		</div>
	{/if}
</div>
