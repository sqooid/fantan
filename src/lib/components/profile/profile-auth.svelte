<script lang="ts">
	import type { UsersResponse } from '$lib/pocketbase-types';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import OauthSigninButton from '../oauth-signin-button.svelte';
	import GoogleIcon from '$lib/icons/google-icon.svelte';
	import LinkAuthButton from './link-auth-button.svelte';
	import GithubIcon from '$lib/icons/github-icon.svelte';

	$: info = ($authStore?.model ?? {}) as UsersResponse;

	const authProvidersQuery = useQuery(['user'], async () => {
		const linked = await pb.collection('users').listExternalAuths(info.id);
		const available = await pb.collection('users').listAuthMethods();
		return { linked, available };
	});

	$: linked = $authProvidersQuery.data?.linked.map((x) => x.provider) ?? [];

	const onVisChange = () => {
		pb.collection('users').authRefresh();
	};
</script>

<svelte:document on:visibilitychange={onVisChange} />

<LinkAuthButton
	icon={GoogleIcon}
	name="Google"
	provider="google"
	linked={linked.includes('google')}
	only={linked.length === 1 && linked[0] === 'google'}
/>

<LinkAuthButton
	icon={GithubIcon}
	name="Gitub"
	provider="github"
	linked={linked.includes('github')}
	only={linked.length === 1 && linked[0] === 'github'}
/>
