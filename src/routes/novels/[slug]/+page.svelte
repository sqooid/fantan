<script lang="ts">
	import { page } from '$app/stores';
	import type { ChaptersResponse, NovelsResponse } from '$lib/pocketbase-types';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { BookText } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';

	import moment from 'moment';
	import { Ellipsis } from '$lib/shadcn/components/ui/breadcrumb';
	import MarkdownIt from 'markdown-it';

	$: novelId = $page.params.slug;

	$: if ($novelQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: $novelQuery.data.title, href: `/edit/novels/${novelId}` }
		];

	const novelQuery = useQuery<NovelsResponse>({ enabled: false });
	$: novelQuery.setOptions({
		enabled: true,
		queryKey: ['novel', novelId],
		queryFn: () => pb.collection('novels').getOne(novelId)
	});
	$: editors = [...($novelQuery.data?.editors ?? []), $novelQuery.data?.owner];

	const chaptersQuery = useQuery<ChaptersResponse[]>({ enabled: false });
	$: chaptersQuery.setOptions({
		enabled: true,
		queryKey: ['chapters', novelId],
		queryFn: async () => {
			const result = await pb.collection('chapters').getFullList({
				filter: pb.filter('novel = {:id} && published = true', { id: novelId }),
				fields: 'id,value,title,updated'
			});
			result.sort((x, y) => semverChapterSort(x.value, y.value));
			return result;
		}
	});

	$: lastChapter = $authStore?.model?.history?.[novelId] as string | undefined;

	const md = new MarkdownIt();
	$: descriptionHtml = $novelQuery.data ? md.render($novelQuery.data?.description) : '';

	let nextChapter: ChaptersResponse | null = null;
	$: if (lastChapter && $chaptersQuery.data?.length) {
		const lastIndex = $chaptersQuery.data.findIndex((x) => x.id === lastChapter);
		if ($chaptersQuery.data.length > lastIndex + 1) {
			nextChapter = $chaptersQuery.data[lastIndex + 1];
		}
	}
	$: if (!lastChapter) {
		nextChapter = null;
	}

	const onResetProgress = async () => {
		const history = $authStore?.model?.history;
		if (history) {
			delete history[novelId];
			await pb.collection('users').update($authStore.model.id, { history });
			pb.collection('users').authRefresh();
		}
	};
</script>

{#if $novelQuery.isSuccess}
	<div class="flex flex-col gap-16 max-w-4xl mx-auto pb-32">
		<div class="flex flex-col sm:grid grid-cols-[auto_1fr] gap-4">
			{#if $novelQuery.data.cover}
				<img
					class="w-80 h-80 rounded-md self-center"
					src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
					alt={`${$novelQuery.data.title} cover image`}
				/>
			{:else}
				<div class="w-80 h-full flex items-center justify-center">
					<BookText class="w-32 h-32" />
				</div>
			{/if}
			<div class="h-full flex flex-col justify-between">
				<div>
					<h1 class="h1">{$novelQuery.data.title}</h1>
					{#if descriptionHtml}
						<div class="mt-7">
							{@html descriptionHtml}
						</div>
					{:else}
						<p class="p">No description</p>
					{/if}
					<div class="flex items-center mt-4 gap-4">
						{#if editors.includes($authStore?.model?.id)}
							<Button href={`/edit/novels/${novelId}`} variant="outline">Edit</Button>
						{/if}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button builders={[builder]} variant="ghost">
									<Ellipsis />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item on:click={onResetProgress}>Reset progress</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
				{#if $chaptersQuery.data}
					<Button
						class="w-fit mt-8"
						href={nextChapter
							? `/chapters/${nextChapter.id}`
							: `/chapters/${$chaptersQuery.data[0]?.id}`}
					>
						{nextChapter ? `Continue from Chapter ${nextChapter.value}` : 'Start reading'}
					</Button>
				{/if}
			</div>
		</div>
		<h2 class="h2">Chapters</h2>
		{#if $chaptersQuery.data?.length}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each $chaptersQuery.data as chapter}
					<Button
						href={`/chapters/${chapter.id}`}
						class="w-full flex flex-col items-start h-fit gap-1"
						variant="ghost"
					>
						<div class="flex gap-8 justify-start">
							<span class="w-8 hover:no-underline">{chapter.value}</span>
							<span>{chapter.title || 'No title'}</span>
						</div>

						<span class="muted ml-16">{moment(chapter.updated).fromNow()}</span>
					</Button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
