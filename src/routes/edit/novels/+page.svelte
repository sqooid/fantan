<script lang="ts">
	import CreateNovelModal from '$lib/components/create-novel-modal.svelte';
	import NovelEditList from '$lib/components/novel-list.svelte';
</script>

<div class="w-full flex flex-col gap-8">
	<div>
		<CreateNovelModal />
	</div>
	<NovelEditList />
</div>
