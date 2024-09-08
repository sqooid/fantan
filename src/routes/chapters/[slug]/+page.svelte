<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import Reader from '$lib/components/reader/reader.svelte';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { useQuery } from '@sveltestack/svelte-query';

	$: chapterId = $page.params.slug;

	const chapterQuery = useQuery<ChaptersResponse>({ enabled: true });
	$: chapterQuery.setOptions({
		queryKey: ['chapter', chapterId],
		queryFn: async () => {
			const result = await pb.collection('chapters').getOne(chapterId, { expand: 'novel' });
			return result;
		}
	});

	const chaptersQuery = useQuery<ChaptersResponse[]>({ enabled: false });
	$: if ($chapterQuery.data) {
		chaptersQuery.setOptions({
			enabled: true,
			queryKey: ['chapters', $chapterQuery.data.novel],
			queryFn: async () => {
				const result = await pb.collection('chapters').getFullList({
					filter: pb.filter('novel = {:novelId} && published = true', {
						novelId: $chapterQuery.data.novel
					}),
					fields: 'id,value,title'
				});
				result.sort((a, b) => semverChapterSort(a.value, b.value));
				console.log(result);

				return result;
			}
		});
	}
	$: chapterIndex = $chaptersQuery.data?.findIndex((c) => c.id === chapterId) ?? -1;
	$: previousChapter = $chaptersQuery.data?.[chapterIndex - 1];
	$: nextChapter = $chaptersQuery.data?.[chapterIndex + 1];

	$: data = $chapterQuery.data;
	$: chapterContent = data?.content as ChapterSection | null;
	$: notes = (data?.notes ?? {}) as Record<string, string>;

	const onScroll = () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		}
	};
</script>

<svelte:document on:scroll={onScroll} />

<div class="flex flex-col w-full gap-4">
	{#if data}
		<h1 class="max-w-prose mx-auto">Chapter {data.value}{data.title ? ` - ${data.title}` : ''}</h1>
	{/if}
	{#if chapterContent}
		<div class="p-8 mt-24 mb-32">
			<Reader
				sourceContent={chapterContent.source}
				translatedContent={chapterContent.translated}
				{notes}
			/>
		</div>
		<div class="w-full p-16 flex justify-between">
			{#if $chaptersQuery.data?.length && chapterIndex > -1}
				{#if previousChapter}
					<Button href={`/chapters/${previousChapter.id}`} variant="outline"
						>Previous chapter</Button
					>
				{:else}
					<div></div>
				{/if}
				{#if nextChapter}
					<Button href={`/chapters/${nextChapter.id}`} variant="outline">Next chapter</Button>
				{/if}
			{/if}
		</div>
	{/if}
</div>
