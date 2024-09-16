<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalLoadingBar from '$lib/components/global-loading-bar.svelte';
	import ReaderPage from '$lib/pages/reader-page.svelte';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/stores/pocketbase';
	import { chapterToPath, markdownText } from '$lib/utils/data-transform';
	import { useQuery } from '@sveltestack/svelte-query';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	export let data: PageData;
	console.log(data);

	const chapterPattern = /^chapter-(\d+)$/;
	const volumePattern = /^volume-(\d+)$/;

	$: novelSlug = $page.params.novelSlug;
	$: volume = $page.params.volume.match(volumePattern)?.[1];
	$: chapter = $page.params.chapter.match(chapterPattern)?.[1];

	const chapterQuery = useQuery<ChaptersResponse>({ enabled: false });
	$: if (novelSlug && volume && chapter) {
		chapterQuery.setOptions({
			queryKey: ['chapter', { novelSlug, volume, chapter }],
			queryFn: async () => {
				const novelResult = await pb
					.collection('novels')
					.getFirstListItem(pb.filter('slug = {:slug}', { slug: novelSlug }), { fields: 'id' });
				const novelId = novelResult.id;
				const result = await pb.collection('chapters').getFirstListItem(
					pb.filter('novel = {:novelId} && volume = {:volume} && value = {:chapter}', {
						novelId,
						volume,
						chapter
					}),
					{ fields: 'id' }
				);
				return result;
			},
			onError(err) {
				if (err instanceof ClientResponseError) {
					if (err.status === 404) {
						toast.error('Chapter not found');
						goto('/');
					}
				}
			}
		});
	} else {
		chapterQuery.setEnabled(false);
	}

	$: linkFormat = (chapter: ChaptersResponse) => {
		return chapterToPath(chapter, novelSlug);
	};

	let metaTitle = '';
	let metaDescription = '';
	if (!browser) {
		metaTitle = data.chapterId
			? `Fantan | ${data.novelTitle} | Volume ${data.volume} | Chapter ${data.chapter}`
			: data.novelTitle
				? `Fantan | ${data.novelTitle} | Chapter not found`
				: 'Fantan | Novel not found';
		metaDescription = data.novelTitle ? markdownText(data.description) : 'Novel does not exist';
		console.log(data);
	}
</script>

<svelte:head>
	{#if !browser}
		<title>{metaTitle}</title>
		<meta name="description" content={metaDescription} />
		<meta property="og:title" content={metaTitle} />
		<meta name="twitter:title" content={metaTitle} />
	{/if}
</svelte:head>

{#if $chapterQuery.data}
	<ReaderPage chapterId={$chapterQuery.data.id} chapterLinkFormat={linkFormat} {novelSlug} />
{:else}
	<GlobalLoadingBar />
{/if}
