<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { isMobile } from '$lib/stores/breakpoints';
	import { authStore } from '$lib/stores/pocketbase';
	import { Menu } from 'lucide-svelte';
	import HeaderButton from './header-button.svelte';
	import ModeToggle from './navigation/mode-toggle.svelte';
	import Sidebar from './navigation/sidebar.svelte';

	const onLogout = () => {
		$authStore?.clear();
		goto('/');
	};

	let showSidebar = false;
</script>

<header
	class="fixed left-0 top-0 right-0 h-16 px-4 items-center backdrop-blur-xl border-b border-solid border-input grid grid-cols-[auto_1fr_auto]"
>
	<div>
		{#if $isMobile}
			<Button variant="ghost" on:click={() => (showSidebar = true)}>
				<Menu />
			</Button>
		{:else}
			<HeaderButton href="/">Browse</HeaderButton>
			<HeaderButton href="/create" altPaths={['/edit/novels']}>Create</HeaderButton>
		{/if}
	</div>
	<div></div>
	<div class="flex items-center gap-2">
		<ModeToggle />
		{#if $authStore?.isValid}
			<Button variant="ghost" on:click={onLogout}>Log out</Button>
		{:else}
			<HeaderButton href="/login">Log in</HeaderButton>
		{/if}
	</div>
</header>
<Sidebar bind:open={showSidebar} />
