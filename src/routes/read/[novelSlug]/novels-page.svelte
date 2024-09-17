<script lang="ts">
	import NovelMeta from '$lib/components/reader/novel-meta.svelte';
	import type { ChaptersResponse, NovelsResponse } from '$lib/pocketbase-types';
	import { Ellipsis } from '$lib/shadcn/components/ui/breadcrumb';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';
	import { breadcrumbStore } from '$lib/stores/navigation';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { chapterToPath } from '$lib/utils/data-transform';
	import { useQuery } from '@sveltestack/svelte-query';
	import { BookText } from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';
	import moment from 'moment';

	export let novelId: string;
	export let novelSlug = '';

	$: if ($novelQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: $novelQuery.data.title, href: `/read/${novelSlug}` }
		];

	const novelQuery = useQuery<NovelsResponse>({ enabled: false });
	$: novelQuery.setOptions({
		enabled: true,
		queryKey: ['novel', { id: novelId, full: true }],
		queryFn: () => pb.collection('novels').getOne(novelId)
	});
	$: editors = [...($novelQuery.data?.editors ?? []), $novelQuery.data?.owner];

	const chaptersQuery = useQuery<ChaptersResponse[]>({ enabled: false });
	$: chaptersQuery.setOptions({
		enabled: true,
		queryKey: ['chapters', { novel: novelId, full: false }],
		queryFn: async () => {
			const result = await pb.collection('chapters').getFullList({
				filter: pb.filter('novel = {:id} && published = true', { id: novelId }),
				fields: 'id,value,title,updated,volume'
			});
			result.sort((x, y) => semverChapterSort(x.value, y.value));
			return result;
		}
	});

	$: lastChapter = $authStore?.model?.history?.[novelId] as string | undefined;

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

<svelte:head>
	<title>Fantan | {$novelQuery.data?.title ?? ''}</title>
	<meta name="description" content={$novelQuery.data?.description ?? ''} />
</svelte:head>

{#if $novelQuery.data}
	<div class="flex flex-col gap-16 max-w-4xl mx-auto pb-32">
		<div class="flex flex-col sm:grid grid-cols-[auto_1fr] gap-4">
			{#if $novelQuery.data.cover}
				<img
					class="w-80 min-h-80 h-fit rounded-md self-center object-cover"
					src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
					alt={`${$novelQuery.data.title} cover image`}
				/>
			{:else}
				<div class="w-80 h-full flex items-center justify-center">
					<BookText class="w-32 h-32" />
				</div>
			{/if}
			<div class="h-full flex flex-col justify-between">
				<div class="flex flex-col gap-4">
					<h1 class="h1">{$novelQuery.data.title}</h1>
					<NovelMeta novel={$novelQuery.data} chapterCount={$chaptersQuery.data?.length ?? 0} />
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
				{#if $chaptersQuery.data?.length}
					<Button
						class="w-fit mt-8"
						href={nextChapter
							? chapterToPath(nextChapter, novelSlug)
							: chapterToPath($chaptersQuery.data[0], novelSlug)}
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
						href={chapterToPath(chapter, novelSlug)}
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
