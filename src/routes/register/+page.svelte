<script lang="ts">
	import EmailRegister from '$lib/components/email-register.svelte';
	import OauthSigninButton from '$lib/components/oauth-signin-button.svelte';
	import GithubIcon from '$lib/icons/github-icon.svelte';
	import GoogleIcon from '$lib/icons/google-icon.svelte';
</script>

<div class="flex flex-col gap-4 max-w-prose">
	<EmailRegister />
	<OauthSigninButton provider="google" name="Google"><GoogleIcon class="h-6" /></OauthSigninButton>
	<OauthSigninButton provider="github" name="Github"><GithubIcon class="h-6" /></OauthSigninButton>
</div>
