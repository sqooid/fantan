<script lang="ts">
	import { authStore } from '$lib/stores/pocketbase';
	import { ArrowLeftToLine } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import ModeToggle from './mode-toggle.svelte';
	import SidebarButton from './sidebar-button.svelte';

	export let open = false;

	const onClose = () => (open = false);

	const onLogout = () => {
		$authStore?.clear();
		onClose();
	};
</script>

{#if open}
	<div
		class="flex flex-col w-64 max-w-[80%] fixed top-0 bottom-0 left-0 py-16 px-2 bg-background z-50 gap-2 justify-between"
		transition:slide={{ axis: 'x', duration: 100 }}
	>
		<div class="flex flex-col gap-4">
			<SidebarButton on:click={onClose} class="mb-10">
				<ArrowLeftToLine />
			</SidebarButton>
			<SidebarButton href="/" on:click={onClose}>Browse</SidebarButton>
			<SidebarButton href="/create" on:click={onClose}>Create</SidebarButton>
		</div>
		<div class="justify-self-end">
			<ModeToggle class="w-full" />
			<SidebarButton on:click={onLogout} class="mt-10">Log out</SidebarButton>
		</div>
	</div>
	<button
		class="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
		on:click={() => (open = false)}
		transition:fade={{ duration: 100 }}
	></button>
{/if}
