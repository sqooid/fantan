<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { ArrowLeftToLine } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import SidebarButton from './sidebar-button.svelte';

	export let open = false;

	const onClose = () => (open = false);
</script>

{#if open}
	<div
		class="flex flex-col w-64 max-w-[80%] fixed top-0 bottom-0 left-0 py-16 px-2 bg-background z-50 gap-2"
		transition:slide={{ axis: 'x', duration: 100 }}
	>
		<SidebarButton on:click={onClose} class="mb-10">
			<ArrowLeftToLine />
		</SidebarButton>
		<SidebarButton href="/" on:click={onClose}>Browse</SidebarButton>
		<SidebarButton href="/create" on:click={onClose}>Create</SidebarButton>
	</div>
	<button
		class="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
		on:click={() => (open = false)}
		transition:fade={{ duration: 100 }}
	></button>
{/if}
