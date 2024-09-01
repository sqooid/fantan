<script lang="ts">
	import type { ChaptersResponse } from '$lib/pocketbase-types';

	export let chapter: ChaptersResponse;
	export let edit = false;

	const href = edit ? `/chapters/${chapter.id}` : `/edit/chapters/${chapter.id}`;
</script>

<a {href} class="">
	Chapter {chapter.value}
	{chapter.value ? ` - ${chapter.title}` : ''}
</a>
