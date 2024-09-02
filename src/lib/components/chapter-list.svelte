<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import ChapterListItem from './chapter-list-item.svelte';
	import CreateChapterModal from './create-chapter-modal.svelte';

	export let novelId: string;
	export let edit = false;

	const chaptersQuery = useQuery(['chapters', novelId], async () => {
		const result = await pb.collection('chapters').getList(0, 100, {
			filter: pb.filter('novel = {:novelId}', { novelId }),
			fields: 'id,value,title'
		});
		return result;
	});
</script>

<div class="flex flex-col">
	<div class="flex gap-8">
		<span class="font-extrabold text-2xl">Chapters</span>
		{#if edit}
			<CreateChapterModal {novelId} />
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
