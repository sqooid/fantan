<script lang="ts">
	import { page } from '$app/stores';
	import ChapterList from '$lib/components/chapter-list.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';

	const novelId = $page.params.slug;

	const novelQuery = useQuery(['novel', novelId], async () => {
		const result = await pb.collection('novels').getOne(novelId, {});
		return result;
	});
</script>

{#if $novelQuery.isSuccess}
	<div class="flex flex-col">
		<div class="flex gap-8">
			<img
				class="h-64"
				src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
				alt={`${$novelQuery.data.title} cover image`}
			/>
			<div class="prose dark:prose-invert">
				<h1>{$novelQuery.data.title}</h1>
				<span>{$novelQuery.data.description}</span>
			</div>
		</div>
	</div>
	<ChapterList edit {novelId} />
{/if}
