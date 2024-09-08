<script lang="ts">
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import NovelEditListItem from './novel-edit-list-item.svelte';

	export let edit = true;

	const novelsQuery = useQuery(['novels', 'edit'], async () => {
		const result = await pb.collection('novels').getFullList({
			filter: edit
				? pb.filter('owner = {:id} || editors ?= {:id}', { id: $authStore?.model?.id })
				: pb.filter('chaptersCount > 0')
		});
		return result;
	});
</script>

{#if $novelsQuery.isSuccess}
	<div class="flex gap-8">
		{#each $novelsQuery.data as novel}
			<NovelEditListItem {novel} {edit} />
		{:else}
			<div class="w-full h-full p-8">
				<h4 class="mx-auto w-fit">No novels created yet</h4>
			</div>
		{/each}
	</div>
{/if}
