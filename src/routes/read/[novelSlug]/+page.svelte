<script lang="ts">
	import { page } from '$app/stores';
	import NovelsPage from '$lib/pages/novels-page.svelte';
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';

	$: novelSlug = $page.params.novelSlug;

	const novelQuery = useQuery<NovelsResponse>({ enabled: false });
	$: if (novelSlug) {
		novelQuery.setOptions({
			enabled: true,
			queryKey: ['novel', novelSlug],
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
	<NovelsPage novelId={$novelQuery.data.id} />
{:else}
	<p>Loading...</p>
{/if}
