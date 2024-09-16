<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import * as Table from '$lib/shadcn/components/ui/table';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import moment from 'moment';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { writable } from 'svelte/store';
	import CreateChapterModal from './create-chapter-modal.svelte';
	import { addSortBy, addTableFilter, addColumnFilters } from 'svelte-headless-table/plugins';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { ArrowUpDown } from 'lucide-svelte';
	import { semverChapterSort } from '$lib/utils/content';
	import ChapterListDatatableAction from './chapter-list-datatable-action.svelte';
	import ChapterListVisibility from './chapter-list-visibility.svelte';
	import { Input } from '$lib/shadcn/components/ui/input';
	import { add } from 'lodash-es';
	import MassMdImport from './editor/mass-md-import.svelte';

	export let novelId: string;
	export let edit = false;

	const chaptersQuery = useQuery(
		['chapters', { novel: novelId, full: false }],
		async () => {
			const result = await pb.collection('chapters').getList(0, 100, {
				filter: pb.filter('novel = {:novelId}', { novelId }),
				fields: 'id,value,title,published,created,updated,volume'
			});
			return result;
		},
		{
			onSuccess(data) {
				$tableData = data.items;
			}
		}
	);

	const onClickCell = (row: any, id: string) => {
		const data = row.original as ChaptersResponse;
		if (!utilityColumns.includes(id)) {
			goto(`/edit/chapters/${data.id}`);
		}
	};

	const formatDate = (d: any) => moment(d).fromNow();

	const tableData = writable($chaptersQuery.data?.items ?? []);
	const table = createTable(tableData, {
		sort: addSortBy({
			toggleOrder: ['asc', 'desc'],
			initialSortKeys: [
				{ id: 'volume', order: 'asc' },
				{ id: 'value', order: 'asc' }
			]
		}),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'volume',
			header: 'Volume'
		}),
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
		}),
		table.column({
			accessor: ({ id, published }) => ({ id, published }),
			id: 'visibility',
			header: 'Visible',
			cell: ({ value }) => {
				return createRender(ChapterListVisibility, { ...(value as any), novelId });
			},
			plugins: { sort: { disable: true } }
		}),
		table.column({
			accessor: 'id',
			header: '',
			cell: ({ value }) => {
				return createRender(ChapterListDatatableAction, { id: value, novelId });
			},
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		})
	]);

	const utilityColumns = ['id', 'visibility'];

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { filterValue } = pluginStates.filter;

	const layoutClassMap: any = {
		title: 'w-full'
	};
	const cellClassMap: any = {
		title: 'w-full',
		id: 'flex items-center'
	};
</script>

<div class="flex flex-col">
	<div class="flex gap-8">
		<h2 class="h2">Chapters</h2>
		{#if edit}
			<CreateChapterModal {novelId} />
			<MassMdImport {novelId} />
		{/if}
	</div>
	{#if $chaptersQuery.isSuccess}
		<div class="w-full mx-auto py-10">
			<div class="flex items-center py-4">
				<Input class="w-full" placeholder="Filter rows..." type="text" bind:value={$filterValue} />
			</div>
			<div class="rounded-md border">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class={layoutClassMap[cell.id]}>
												{#if utilityColumns.includes(cell.id)}
													<Render of={cell.render()} />
												{:else}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class="ml-2 h-4 w-4" />
													</Button>
												{/if}
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
											<Table.Cell {...attrs} on:click={() => onClickCell(row, cell.id)}>
												<div class={`mx-auto w-fit ${cellClassMap[cell.id] ?? ''}`}>
													<Render
														of={cell.isData() && (cell.id === 'updated' || cell.id === 'created')
															? formatDate(cell.value)
															: cell.render()}
													/>
												</div>
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
