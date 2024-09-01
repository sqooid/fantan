<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterContent } from '$lib/components/editor/content-types';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import RichButton from '$lib/components/inputs/rich-button.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';

	const chapterId = $page.params.slug;

	const toast = getToastStore();
	let editor: SplitEditor;

	const chapterQuery = useQuery(['chapter', chapterId], () => {
		const result = pb.collection('chapters').getOne(chapterId);
		return result;
	});
	$: content = $chapterQuery.data?.content as ChapterContent;

	const saveMutation = useMutation(
		() => {
			content.sections = editor.getSections();
			const result = pb.collection('chapters').update(chapterId, { content });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.trigger({ message: 'Saved changes', background: 'variant-filled-success' });
			},
			onError(error, variables, context) {
				toast.trigger({ message: 'Failed to save changes', background: 'variant-filled-error' });
			}
		}
	);
</script>

{#if $chapterQuery.isSuccess}
	<h1 class="text-3xl font-bold">
		{$chapterQuery.data.value} -
		<span class="opacity-20 text-3xl font-normal">{$chapterQuery.data.title || 'No title'}</span>
	</h1>
	<RichButton class="variant-filled" on:click={() => $saveMutation.mutate()}>Save</RichButton>
	<SplitEditor bind:this={editor} {content} />
{/if}
