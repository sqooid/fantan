<script lang="ts">
	import EmailLogin from '$lib/components/auth/email-login.svelte';
	import OauthSigninButton from '$lib/components/auth/oauth-signin-button.svelte';
	import GithubIcon from '$lib/icons/github-icon.svelte';
	import GoogleIcon from '$lib/icons/google-icon.svelte';
	import { genRedirectLinkWithQueries } from '$lib/utils/ui';
</script>

<div class="flex flex-col items-center gap-4 max-w-lg mx-auto">
	<EmailLogin />
	<div>or</div>
	<OauthSigninButton provider="google" name="Google" class="w-full"
		><GoogleIcon class="h-6" />Sign in with Google</OauthSigninButton
	>
	<OauthSigninButton provider="github" name="Github" class="w-full"
		><GithubIcon class="h-6" />Sign in with Github</OauthSigninButton
	>
	<div>
		Don't have an account? <a href={genRedirectLinkWithQueries('/register')} class="anchor"
			>Sign up</a
		>
	</div>
</div>
