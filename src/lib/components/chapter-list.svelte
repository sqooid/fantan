<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import ChapterListItem from './chapter-list-item.svelte';
	import CreateChapterModal from './create-chapter-modal.svelte';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, writable } from 'svelte/store';
	import * as Table from '$lib/shadcn/components/ui/table';

	export let novelId: string;
	export let edit = false;

	const chaptersQuery = useQuery(
		['chapters', novelId],
		async () => {
			const result = await pb.collection('chapters').getList(0, 100, {
				filter: pb.filter('novel = {:novelId}', { novelId }),
				fields: 'id,value,title'
			});
			return result;
		},
		{
			onSuccess(data) {
				$tableData = data.items;
			}
		}
	);

	const tableData = writable($chaptersQuery.data?.items ?? []);
	const table = createTable(tableData);
	const columns = table.createColumns([
		table.column({
			accessor: 'value',
			header: 'Number'
		}),
		table.column({
			accessor: 'title',
			header: 'Title'
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
</script>

<div class="flex flex-col gap-8">
	<div class="flex gap-8">
		<span class="font-extrabold text-2xl">Chapters</span>
		{#if edit}
			<CreateChapterModal {novelId} />
		{/if}
	</div>
	{#if $chaptersQuery.isSuccess}
		<div class="flex flex-col gap-1">
			{#each $chaptersQuery.data.items as chapter}
				<ChapterListItem {chapter} />
			{:else}
				<span class="opacity-50">No chapters</span>
			{/each}
		</div>
	{/if}
</div>
