<script lang="ts">
	import NovelList from '$lib/components/novel-list.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';

	$: $breadcrumbStore = [{ title: 'Home', href: '/' }];
</script>

<svelte:head>
	<title>Fantan</title>
	<meta name="description" content="Unofficial web novel translations" />
</svelte:head>

<div class="w-full flex flex-col gap-8">
	<NovelList edit={false} />
</div>
