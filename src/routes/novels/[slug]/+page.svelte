<script lang="ts">
	import { page } from '$app/stores';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import moment from 'moment';

	const novelId = $page.params.slug;
	const queryClient = useQueryClient();

	const novelQuery = useQuery(['novel', novelId], async () => {
		const result = await pb.collection('novels').getOne(novelId);
		return result;
	});
	$: editors = [...($novelQuery.data?.editors ?? []), $novelQuery.data?.owner];

	const chaptersQuery = useQuery(['chapters', novelId], async () => {
		const result = await pb
			.collection('chapters')
			.getFullList({ filter: pb.filter('novel = {:id} && published = true', { id: novelId }) });
		result.sort((x, y) => semverChapterSort(x.value, y.value));
		return result;
	});

	$: lastChapter = $authStore?.model?.history?.[novelId] as string | undefined;
	let nextChapter: ChaptersResponse | null = null;
	$: if (lastChapter && $chaptersQuery.data) {
		const lastIndex = $chaptersQuery.data.findIndex((x) => x.id === lastChapter);
		if ($chaptersQuery.data.length > lastIndex + 1) {
			nextChapter = $chaptersQuery.data[lastIndex + 1];
		}
	}
</script>

{#if $novelQuery.isSuccess}
	<div class="flex flex-col gap-16 max-w-4xl mx-auto pb-32">
		<div class="grid grid-cols-[auto_1fr] gap-4">
			<img
				class="w-80 rounded-md"
				src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
				alt={`${$novelQuery.data.title} cover image`}
			/>
			<div class="h-full flex flex-col justify-between">
				<div>
					<h1>{$novelQuery.data.title}</h1>
					<p>{$novelQuery.data.description}</p>
					{#if editors.includes($authStore?.model?.id)}
						<Button href={`/edit/novels/${novelId}`} variant="outline" class="mt-4">Edit</Button>
					{/if}
				</div>
				{#if $chaptersQuery.isSuccess}
					<Button
						class="w-fit"
						href={nextChapter
							? `/chapters/${nextChapter.id}`
							: `/chapters/${$chaptersQuery.data[0].id}`}
					>
						{nextChapter ? `Continue from chapter ${nextChapter.value}` : 'Start reading'}
					</Button>
				{/if}
			</div>
		</div>
		<h2>Chapters</h2>
		{#if $chaptersQuery.isSuccess}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each $chaptersQuery.data as chapter}
					<Button
						href={`/chapters/${chapter.id}`}
						class="w-full flex flex-col items-start h-fit gap-1"
						variant="ghost"
					>
						<div class="flex gap-8 justify-start">
							<span class="w-8 hover:no-underline">{chapter.value}</span>
							<span>{chapter.title}</span>
						</div>

						<span class="muted ml-16">{moment(chapter.updated).fromNow()}</span>
					</Button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
