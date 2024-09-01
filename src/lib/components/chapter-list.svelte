<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';
	import ChapterListItem from './chapter-list-item.svelte';
	import RichButton from './inputs/rich-button.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import CreateChapterModal from './create-chapter-modal.svelte';

	export let novelId: string;
	export let edit = false;

	const modal = getModalStore();

	const chaptersQuery = useQuery(['chapters', novelId], async () => {
		const result = await pb.collection('chapters').getList(0, 100, {
			filter: pb.filter('novel = {:novelId}', { novelId }),
			fields: 'id,value,title'
		});
		return result;
	});

	const onCreateChapter = async () => {
		modal.trigger({
			type: 'component',
			component: { ref: CreateChapterModal, props: { novelId } }
		});
	};
</script>

<div class="flex flex-col prose dark:prose-invert">
	<div class="flex gap-8">
		<span class="font-extrabold text-2xl">Chapters</span>
		{#if edit}
			<RichButton class="variant-filled" on:click={onCreateChapter}>Create chapter</RichButton>
		{/if}
	</div>
	{#if $chaptersQuery.isSuccess}
		{#each $chaptersQuery.data.items as chapter}
			<ChapterListItem {chapter} />
		{:else}
			<span>No chapters</span>
		{/each}
	{/if}
</div>
