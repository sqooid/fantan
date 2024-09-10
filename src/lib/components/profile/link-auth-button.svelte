<script lang="ts">
	import OauthSigninButton from '../oauth-signin-button.svelte';

	export let only: boolean;
	export let linked: boolean;
	export let icon;
	export let name: string;
	export let provider: string;
</script>

<OauthSigninButton {provider} class={`w-full ${only ? 'pointer-events-none' : ''}`} unlink={linked}>
	<svelte:component this={icon} class="h-6" />
	{#if only}
		{name} account linked
	{:else if linked}
		Unlink {name} account
	{:else}
		Link with {name} account
	{/if}
</OauthSigninButton>
