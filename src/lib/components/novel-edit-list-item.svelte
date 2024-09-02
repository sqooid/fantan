<script lang="ts">
	import type { NovelsResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/stores/pocketbase';

	export let novel: NovelsResponse;
</script>

<a class="card p-8 flex flex-col gap-4" href={`/edit/novels/${novel.id}`}>
	<img
		src={pb.files.getUrl(novel, novel.cover)}
		alt={`${novel.title} cover image`}
		class="h-48 rounded-lg w-fit self-center"
	/>
	<span class="font-bold text-2xl">{novel.title}</span>
	<span class="opacity-50">{novel.description || 'No description'}</span>
</a>
