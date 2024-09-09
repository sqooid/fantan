<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { authStore } from '$lib/stores/pocketbase';
	import HeaderButton from './header-button.svelte';
	import ModeToggle from './navigation/mode-toggle.svelte';

	const onLogout = () => {
		$authStore?.clear();
		goto('/');
	};
</script>

<header
	class="p-4 backdrop-blur-md border-b border-solid border-input grid grid-cols-[auto_1fr_auto]"
>
	<div>
		<HeaderButton href="/">Browse</HeaderButton>
		<HeaderButton href="/create" altPaths={['/edit/novels']}>Create</HeaderButton>
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
