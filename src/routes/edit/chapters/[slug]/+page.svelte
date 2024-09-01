<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterContent } from '$lib/components/editor/content-types';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';

	const chapterId = $page.params.slug;

	const chapterQuery = useQuery(['chapter', chapterId], () => {
		const result = pb.collection('chapters').getOne(chapterId);
		return result;
	});
	$: content = $chapterQuery.data?.content as ChapterContent;
</script>

{#if $chapterQuery.isSuccess}
	<SplitEditor {content} />
{/if}
