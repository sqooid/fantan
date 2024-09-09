<script lang="ts">
	import CreateNovelModal from '$lib/components/create-novel-modal.svelte';
	import NovelEditList from '$lib/components/novel-list.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';

	$: $breadcrumbStore = [
		{ title: 'Home', href: '/' },
		{ title: 'Create', href: '/create' }
	];
</script>

<div class="w-full flex flex-col gap-8">
	<div>
		<CreateNovelModal />
	</div>
	<NovelEditList />
</div>
