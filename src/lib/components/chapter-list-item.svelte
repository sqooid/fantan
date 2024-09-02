<script lang="ts">
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';

	export let chapter: ChaptersResponse;
	export let edit = false;

	const href = edit ? `/chapters/${chapter.id}` : `/edit/chapters/${chapter.id}`;
</script>

<Button {href} variant="ghost" class="p-8">
	<div class="p-8">
		Chapter {chapter.value}
		{chapter.value ? ` - ${chapter.title}` : ''}
	</div>
</Button>
