<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { isMobile } from '$lib/stores/breakpoints';
	import { authStore } from '$lib/stores/pocketbase';
	import { Menu } from 'lucide-svelte';
	import HeaderButton from './header-button.svelte';
	import ModeToggle from './navigation/mode-toggle.svelte';
	import Sidebar from './navigation/sidebar.svelte';
	import { page } from '$app/stores';
	import ReaderOptions from './reader/reader-options.svelte';
	import UserDropdown from './navigation/user-dropdown.svelte';
	import { novelIdStore } from '$lib/stores/navigation';
	import { readerOptions } from '$lib/stores/options';

	const onLogout = () => {
		$authStore?.clear();
		goto('/');
	};

	const readerPattern = /\/read\/.+\/.+\/chapter-.+/;
	$: inReader = readerPattern.test($page.url.pathname);
	const editorPattern = /\/edit\/chapters\/.+/;
	$: inEditor = editorPattern.test($page.url.pathname);

	let showSidebar = false;
</script>

<header
	class={`fixed left-0 top-0 right-0 h-16 px-4 items-center border-b border-solid border-input grid grid-cols-[auto_1fr_auto] ${inReader ? 'bg-background' : 'backdrop-blur-xl'} z-10`}
>
	<div class="flex items-center gap-4">
		{#if $isMobile}
			<Button variant="ghost" on:click={() => (showSidebar = true)}>
				<Menu />
			</Button>
			{#if inReader && $novelIdStore}
				<HeaderButton href={`/novels/${$novelIdStore}`} outline>Chapters</HeaderButton>
			{/if}
		{:else}
			<HeaderButton href="/">Browse</HeaderButton>
			<HeaderButton href="/create" altPaths={['/edit/novels']}>Create</HeaderButton>
		{/if}
	</div>
	<div></div>
	<div class="flex items-center gap-4">
		{#if inReader}
			<ReaderOptions title="Reader options" reader />
		{:else if inEditor}
			<ReaderOptions title="Editor options" />
		{/if}
		{#if !$isMobile}
			<ModeToggle />
		{/if}
		{#if !$authStore?.isValid}
			<HeaderButton href="/login">Log in</HeaderButton>
		{:else}
			<UserDropdown />
		{/if}
	</div>
</header>
<Sidebar bind:open={showSidebar} />
