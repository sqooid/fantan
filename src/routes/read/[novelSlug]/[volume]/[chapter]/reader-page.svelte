<script lang="ts">
	import CommentSection from '$lib/components/comments/comment-section.svelte';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import Reader from '$lib/components/reader/reader.svelte';
	import type { ChaptersResponse, NovelsResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { breadcrumbStore, novelIdStore } from '$lib/stores/navigation';
	import { readerInfo } from '$lib/stores/options';
	import { authStore, pb, turnstileJwt } from '$lib/stores/pocketbase';
	import { semverChapterSort } from '$lib/utils/content';
	import { chapterToDisplay, chapterToPath } from '$lib/utils/data-transform';
	import { useQuery } from '@sveltestack/svelte-query';
	import { debounce } from 'lodash-es';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';

	export let chapterId: string;
	export let novelSlug: string = '';
	export let chapterLinkFormat = (chapter: ChaptersResponse) => {
		return `/chapters/${chapter.id}`;
	};

	$: if (novel && $chapterQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: novel.title, href: `/read/${novelSlug}` },
			{
				title: chapterToDisplay($chapterQuery.data),
				href: chapterToPath($chapterQuery.data, novel.slug)
			}
		];

	// Visit
	const visitChapter = async () => {
		try {
			await pb.send('/c/chapter-visit', {
				method: 'POST',
				body: JSON.stringify({ chapterId, jwt: $turnstileJwt })
			});
		} catch (error) {
			if (error instanceof ClientResponseError) {
				if (error.status === 403) {
					$turnstileJwt = '';
				}
			}
		}
	};
	$: if (chapterId && $turnstileJwt) {
		visitChapter();
	}

	const chapterQuery = useQuery<ChaptersResponse>({ enabled: false });
	$: chapterQuery.setOptions({
		queryKey: ['chapter', { id: chapterId, full: true, expand: 'novel' }],
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

	$: canEdit =
		$authStore?.isValid &&
		(novel?.owner === $authStore?.model?.id || novel?.editors.includes($authStore?.model?.id));

	const ownerQuery = useQuery<{ username: string; name: string; id: string }>({ enabled: false });
	$: if (novel?.owner) {
		ownerQuery.setOptions({
			queryKey: ['user', { id: novel.owner }],
			queryFn: async () => {
				const path = pb.buildUrl(`/c/users?ids=${novel.owner}`);
				const result = await fetch(path);

				if (!result.ok) {
					throw new Error('Failed to fetch user');
				}
				const body = await result.json();
				return body[0];
			},
			enabled: true
		});
	}

	let endDiv: HTMLElement;

	const chaptersQuery = useQuery<ChaptersResponse[]>({ enabled: false });
	$: if ($chapterQuery.data) {
		chaptersQuery.setOptions({
			enabled: true,
			queryKey: ['chapters', { novelId: $chapterQuery.data.novel, full: false }],
			queryFn: async () => {
				const result = await pb.collection('chapters').getFullList({
					filter: pb.filter('novel = {:novelId} && published = true', {
						novelId: $chapterQuery.data.novel
					}),
					fields: 'id,value,title,volume'
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

	let finished = false;
	$: if (chapterId) {
		finished = false;
	}
	$: finishedChapter = debounce(async () => {
		console.log('finished chapter');
		if (novel?.id && $authStore?.model && data && !finished) {
			finished = true;
			const history = $authStore?.model?.history ?? {};
			const lastReadValue = $chaptersQuery.data?.[history[novel.id]]?.value;
			const currentValue = data.value;
			console.log('finished chapter', data.value);
			toast.info('Finished chapter');

			if (lastReadValue === undefined || semverChapterSort(lastReadValue, currentValue) < 0) {
				history[novel.id] = chapterId;
				const result = await pb.collection('users').update($authStore.model.id, { history });
				pb.collection('users').authRefresh();
			}
		}
	}, 1000);

	const onScroll = () => {
		if (!endDiv) return;
		if (
			endDiv.getBoundingClientRect().bottom <
			(window.innerHeight || document.documentElement.clientHeight)
		) {
			finishedChapter();
		}
	};
</script>

<svelte:document on:scroll={onScroll} />

<svelte:head>
	<title
		>Fantan | {novel?.title} | Volume {$chapterQuery.data?.volume} | Chapter {$chapterQuery.data
			?.value}</title
	>
	<meta name="description" content={novel?.description} />
</svelte:head>

<div class="flex flex-col w-full gap-4 mb-24">
	{#if canEdit}
		<div class="flex justify-end">
			<Button href={`/edit/chapters/${chapterId}`} variant="outline">Edit</Button>
		</div>
	{/if}
	<div class="max-w-prose self-center flex flex-col gap-8">
		{#if data}
			<h1 class="h1 mx-auto">Chapter {data.value}{data.title ? ` - ${data.title}` : ''}</h1>
		{/if}
		{#if $ownerQuery.data}
			<h4 class="h4">Editor: {$ownerQuery.data.name || $ownerQuery.data.username}</h4>
		{/if}
	</div>
	{#if chapterContent}
		<div class="p-2 sm:p-8 mt-12 mb-12 sm:mt-24 sm:mb-32">
			<Reader
				sourceContent={chapterContent.source}
				translatedContent={chapterContent.translated}
				{notes}
			/>
		</div>
		<div class="w-full mb-8 p-2 sm:p-16 grid grid-cols-3">
			{#if $chaptersQuery.data?.length && chapterIndex > -1}
				{#if previousChapter}
					<Button
						href={chapterLinkFormat(previousChapter)}
						variant="outline"
						class="justify-self-start">Previous chapter</Button
					>
				{:else}
					<div></div>
				{/if}
				<Button
					href={`/read/${novelSlug}`}
					variant="outline"
					class="justify-self-center invisible sm:visible">Back to chapters</Button
				>
				{#if nextChapter}
					<Button
						href={chapterLinkFormat(nextChapter)}
						variant="outline"
						on:click={finishedChapter}
						class="justify-self-end">Next chapter</Button
					>
				{:else}
					<div></div>
				{/if}
			{/if}
		</div>
	{/if}
	<div class="w-full" bind:this={endDiv}></div>
	<CommentSection {chapterId} />
</div>
