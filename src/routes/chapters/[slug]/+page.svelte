<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import ReaderSide from '$lib/components/reader/reader-side.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';

	const chapterId = $page.params.slug;

	let editor: SplitEditor;

	const chapterQuery = useQuery(['chapter', chapterId], () => {
		const result = pb.collection('chapters').getOne(chapterId);
		return result;
	});

	$: data = $chapterQuery.data;
	$: chapterContent = data?.content as ChapterSection | null;
	$: novelId = data?.novel;
	const novelQuery = useQuery(['novel', novelId], async () => {
		const result = pb.collection('novels').getOne(novelId ?? '');
		return result;
	});
	$: {
		novelQuery.setOptions(['novel', novelId], { enabled: !!novelId });
	}
	$: novelData = $novelQuery.data;
</script>

<div class="flex flex-col w-full gap-4">
	{#if data}
		<h1 class="max-w-prose">Chapter {data.value}{data.title ? ` - ${data.title}` : ''}</h1>
	{/if}
	<div>
		<ReaderSide content={chapterContent?.source} />
		<ReaderSide content={chapterContent?.translated} />
	</div>
</div>
