<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import HeaderButton from './header-button.svelte';

	const onLogout = () => {
		$authStore?.clear();
		goto('/');
	};
</script>

<header class="p-4 backdrop-blur-md bg-white/5 grid grid-cols-[auto_1fr_auto]">
	<div>
		<HeaderButton href="/" name="Browse" />
		<HeaderButton href="/create" name="Create" />
	</div>
	<div></div>
	<div>
		{#if $authStore?.isValid}
			<button type="button" class="btn variant-ghost" on:click={onLogout}>Log out</button>
		{:else}
			<HeaderButton href="/login" name="Log in" />
		{/if}
	</div>
</header>
