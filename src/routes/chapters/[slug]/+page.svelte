<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import Reader from '$lib/components/reader/reader.svelte';
	import type { ChaptersResponse, NovelsResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { breadcrumbStore, novelIdStore } from '$lib/stores/navigation';
	import { readerInfo } from '$lib/stores/options';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { chapterToDisplay } from '$lib/utils/data-transform';
	import { useQuery } from '@sveltestack/svelte-query';
	import { debounce } from 'lodash-es';

	$: chapterId = $page.params.slug;

	$: if (novel && $chapterQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: novel.title, href: `/novels/${novel.id}` },
			{
				title: chapterToDisplay($chapterQuery.data),
				href: `/chapters/${chapterId}`
			}
		];

	const chapterQuery = useQuery<ChaptersResponse>({ enabled: false });
	$: chapterQuery.setOptions({
		queryKey: ['chapter', chapterId],
		queryFn: async () => {
			const result = await pb.collection('chapters').getOne(chapterId, { expand: 'novel' });
			return result;
		},
		enabled: true
	});

	$: novel = ($chapterQuery.data?.expand as any)?.novel as NovelsResponse | undefined;
	$: if (novel) {
		$novelIdStore = novel.id;
		$readerInfo.language.source = novel.sourceLanguage;
	}

	const ownerQuery = useQuery<{ username: string; name: string }>({ enabled: false });
	$: if (novel?.owner) {
		ownerQuery.setOptions({
			queryKey: ['user', novel.owner],
			queryFn: async () => {
				const path = pb.buildUrl(`/c/user?id=${novel.owner}`);
				const result = await fetch(path);
				if (!result.ok) {
					throw new Error('Failed to fetch user');
				}
				return await result.json();
			},
			enabled: true
		});
	}

	const chaptersQuery = useQuery<ChaptersResponse[]>({ enabled: false });
	$: if ($chapterQuery.data) {
		chaptersQuery.setOptions({
			enabled: true,
			queryKey: ['chapters', $chapterQuery.data.novel],
			queryFn: async () => {
				const result = await pb.collection('chapters').getFullList({
					filter: pb.filter('novel = {:novelId} && published = true', {
						novelId: $chapterQuery.data.novel
					}),
					fields: 'id,value,title'
				});
				result.sort((a, b) => semverChapterSort(a.value, b.value));
				return result;
			}
		});
	}
	$: chapterIndex = $chaptersQuery.data?.findIndex((c) => c.id === chapterId) ?? -1;
	$: previousChapter = $chaptersQuery.data?.[chapterIndex - 1];
	$: nextChapter = $chaptersQuery.data?.[chapterIndex + 1];

	$: data = $chapterQuery.data;
	$: chapterContent = data?.content as ChapterSection | null;
	$: notes = (data?.notes ?? {}) as Record<string, string>;

	const finishedChapter = debounce(async () => {
		console.log('finished chapter');

		if (novel?.id && $authStore?.model && data) {
			const history = $authStore?.model?.history ?? {};
			const lastReadValue = $chaptersQuery.data?.[history[novel.id]]?.value;
			const currentValue = data.value;

			if (lastReadValue === undefined || semverChapterSort(lastReadValue, currentValue) < 0) {
				history[novel.id] = chapterId;
				const result = await pb.collection('users').update($authStore.model.id, { history });
				pb.collection('users').authRefresh();
			}
		}
	}, 1000);

	const onScroll = () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			finishedChapter();
		}
	};
</script>

<svelte:document on:scroll={onScroll} />

<div class="flex flex-col w-full gap-4">
	<div class="max-w-prose self-center flex flex-col gap-8">
		{#if data}
			<h1 class="h1 mx-auto">Chapter {data.value}{data.title ? ` - ${data.title}` : ''}</h1>
		{/if}
		{#if $ownerQuery.data}
			<h4 class="h4">Editor: {$ownerQuery.data.name || $ownerQuery.data.username}</h4>
		{/if}
	</div>
	{#if chapterContent}
		<div class="p-8 mt-12 mb-12 sm:mt-24 sm:mb-32">
			<Reader
				sourceContent={chapterContent.source}
				translatedContent={chapterContent.translated}
				{notes}
			/>
		</div>
		<div class="w-full mb-8 p-8 sm:p-16 flex justify-between">
			{#if $chaptersQuery.data?.length && chapterIndex > -1}
				{#if previousChapter}
					<Button href={`/chapters/${previousChapter.id}`} variant="outline"
						>Previous chapter</Button
					>
				{:else}
					<div></div>
				{/if}
				{#if nextChapter}
					<Button href={`/chapters/${nextChapter.id}`} variant="outline" on:click={finishedChapter}
						>Next chapter</Button
					>
				{/if}
			{/if}
		</div>
	{/if}
</div>
