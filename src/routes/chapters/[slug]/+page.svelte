<script lang="ts">
	import { page } from '$app/stores';
	import ReaderPage from '$lib/pages/reader-page.svelte';

	$: chapterId = $page.params.slug;
</script>

<ReaderPage {chapterId} />
