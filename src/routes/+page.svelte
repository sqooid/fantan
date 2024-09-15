<script lang="ts">
	import NovelList from '$lib/components/novel-list.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';

	$: $breadcrumbStore = [{ title: 'Home', href: '/' }];
</script>

<svelte:head>
	<title>Fantan</title>
</svelte:head>

<div class="w-full flex flex-col gap-8">
	<NovelList edit={false} />
</div>
