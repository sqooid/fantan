<script lang="ts">
	import CreateNovelModal from '$lib/components/create-novel-modal.svelte';
	import RichButton from '$lib/components/inputs/rich-button.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modal = getModalStore();
	const onCreate = async () => {
		modal.trigger({ type: 'component', component: { ref: CreateNovelModal } });
	};
</script>

<RichButton class="variant-filled" on:click={onCreate}>Create new novel</RichButton>
