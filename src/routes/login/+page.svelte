<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import EmailLogin from '$lib/components/email-login.svelte';
	import OauthSigninButton from '$lib/components/oauth-signin-button.svelte';
	import GithubIcon from '$lib/icons/github-icon.svelte';
	import GoogleIcon from '$lib/icons/google-icon.svelte';
	import { authStore } from '$lib/stores/pocketbase';
	import { mode } from 'mode-watcher';

	if (browser && $authStore?.isValid) {
		goto('/');
	}
</script>

<div class="flex flex-col items-center gap-4 max-w-lg mx-auto">
	<EmailLogin />
	<div>or</div>
	<OauthSigninButton provider="google" name="Google" class="w-full"
		><GoogleIcon class="h-6" /></OauthSigninButton
	>
	<OauthSigninButton provider="github" name="Github" class="w-full"
		><GithubIcon class="h-6" /></OauthSigninButton
	>
	<div>Don't have an account? <a href="/register" class="anchor">Sign up</a></div>
</div>
