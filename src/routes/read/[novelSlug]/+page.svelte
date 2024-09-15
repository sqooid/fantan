<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GlobalLoadingBar from '$lib/components/global-loading-bar.svelte';
	import NovelsPage from '$lib/pages/novels-page.svelte';
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/stores/pocketbase';
	import { markdownText } from '$lib/utils/data-transform';
	import { useQuery } from '@sveltestack/svelte-query';
	import type { PageData } from './$types';

	$: novelSlug = $page.params.novelSlug;

	export let data: PageData;

	const novelQuery = useQuery<NovelsResponse>({ enabled: false });
	$: if (novelSlug) {
		novelQuery.setOptions({
			enabled: true,
			queryKey: ['novel', { slug: novelSlug }],
			queryFn: () =>
				pb
					.collection('novels')
					.getFirstListItem(pb.filter('slug = {:slug}', { slug: novelSlug }), { fields: 'id' })
		});
	} else {
		novelQuery.setEnabled(false);
	}
</script>

{#if $novelQuery.data}
	<NovelsPage novelId={$novelQuery.data.id} {novelSlug} />
{:else}
	<GlobalLoadingBar />
{/if}
