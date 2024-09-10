<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import EmailRegister from '$lib/components/email-register.svelte';
	import OauthSigninButton from '$lib/components/oauth-signin-button.svelte';
	import GithubIcon from '$lib/icons/github-icon.svelte';
	import GoogleIcon from '$lib/icons/google-icon.svelte';
	import { authStore } from '$lib/stores/pocketbase';

	if (browser && $authStore?.isValid) {
		goto('/');
	}
</script>

<div class="flex flex-col items-center gap-4 max-w-lg mx-auto">
	<EmailRegister />
	<div>or</div>
	<OauthSigninButton provider="google" name="Google" class="w-full">
		<GoogleIcon class="h-6" />Register with Google</OauthSigninButton
	>
	<OauthSigninButton provider="github" name="Github" class="w-full"
		><GithubIcon class="h-6" />Register with Github</OauthSigninButton
	>
</div>
