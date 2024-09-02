<script lang="ts">
	import RichButton from '$lib/components/inputs/rich-button.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import CreateNovelModal from '$lib/components/create-novel-modal.svelte';
	import NovelEditList from '$lib/components/novel-edit-list.svelte';

	const modal = getModalStore();
	const onCreate = async () => {
		modal.trigger({ type: 'component', component: { ref: CreateNovelModal } });
	};
</script>

<div class="w-full flex flex-col gap-8">
	<div>
		<RichButton class="variant-filled" on:click={onCreate}>Create new novel</RichButton>
	</div>
	<NovelEditList />
</div>
