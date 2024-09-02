<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import NovelEditListItem from './novel-edit-list-item.svelte';

	const novelsQuery = useQuery(['novels', 'edit'], async () => {
		const result = await pb.collection('novels').getFullList();
		return result;
	});
</script>

{#if $novelsQuery.isSuccess}
	<div class="flex gap-8">
		{#each $novelsQuery.data as novel}
			<NovelEditListItem {novel} />
		{/each}
	</div>
{/if}
