<script lang="ts">
	import { page } from '$app/stores';
	import ReaderPage from './reader-page.svelte';

	$: chapterId = $page.params.slug;
</script>

<ReaderPage {chapterId} />
