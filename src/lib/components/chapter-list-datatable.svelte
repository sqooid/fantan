<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import ChapterListItem from './chapter-list-item.svelte';
	import CreateChapterModal from './create-chapter-modal.svelte';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, writable } from 'svelte/store';
	import * as Table from '$lib/shadcn/components/ui/table';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import { goto } from '$app/navigation';
	import moment from 'moment';

	export let novelId: string;
	export let edit = false;

	const chaptersQuery = useQuery(
		['chapters', novelId],
		async () => {
			const result = await pb.collection('chapters').getList(0, 100, {
				filter: pb.filter('novel = {:novelId}', { novelId }),
				fields: 'id,value,title,published,created,updated'
			});
			return result;
		},
		{
			onSuccess(data) {
				$tableData = data.items;
			}
		}
	);

	const onClickCell = (row: any) => {
		const data = row.original as ChaptersResponse;
		console.log(data);

		goto(`/edit/chapters/${data.id}`);
	};

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
		}),
		table.column({
			accessor: ({ updated }) => moment(updated).fromNow(),
			header: 'Updated'
		}),
		table.column({
			accessor: ({ created }) => moment(created).fromNow(),
			header: 'Created'
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
</script>

<div class="flex flex-col">
	<div class="flex gap-8">
		<span class="font-extrabold text-2xl">Chapters</span>
		{#if edit}
			<CreateChapterModal {novelId} />
		{/if}
	</div>
	{#if $chaptersQuery.isSuccess}
		<div class="container mx-auto py-10">
			<div class="rounded-md border">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
											<Table.Head {...attrs}>
												<Render of={cell.render()} />
											</Table.Head>
										</Subscribe>
									{/each}
								</Table.Row>
							</Subscribe>
						{/each}
					</Table.Header>
					<Table.Body {...$tableBodyAttrs}>
						{#each $pageRows as row (row.id)}
							<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
								<Table.Row {...rowAttrs}>
									{#each row.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs>
											<Table.Cell {...attrs} on:click={() => onClickCell(row)}>
												<Render of={cell.render()} />
											</Table.Cell>
										</Subscribe>
									{/each}
								</Table.Row>
							</Subscribe>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	{/if}
</div>
