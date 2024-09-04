<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import * as Table from '$lib/shadcn/components/ui/table';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import moment from 'moment';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { writable } from 'svelte/store';
	import CreateChapterModal from './create-chapter-modal.svelte';
	import { addPagination, addSortBy } from 'svelte-headless-table/plugins';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { ArrowUpDown } from 'lucide-svelte';
	import { semverChapterSort } from '$lib/utils/content';

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

	const formatDate = (d: any) => moment(d).fromNow();

	const tableData = writable($chaptersQuery.data?.items ?? []);
	const table = createTable(tableData, {
		sort: addSortBy({
			toggleOrder: ['asc', 'desc'],
			initialSortKeys: [{ id: 'value', order: 'asc' }]
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'value',
			header: 'Number',
			plugins: { sort: { compareFn: semverChapterSort } }
		}),
		table.column({
			accessor: 'title',
			header: 'Title'
		}),
		table.column({
			accessor: 'updated',
			header: 'Updated',
			plugins: {
				sort: {
					getSortValue(value) {
						return moment(value).valueOf();
					}
				}
			}
		}),
		table.column({
			accessor: 'created',
			header: 'Created',
			plugins: {
				sort: {
					getSortValue(value) {
						return moment(value).valueOf();
					}
				}
			}
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
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs}>
												<Button variant="ghost" on:click={props.sort.toggle}>
													<Render of={cell.render()} />
													<ArrowUpDown class="ml-2 h-4 w-4" />
												</Button>
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
												{#if cell.isData() && (cell.id === 'updated' || cell.id === 'created')}
													<Render of={formatDate(cell.value)} />
												{:else}
													<Render of={cell.render()} />
												{/if}
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
