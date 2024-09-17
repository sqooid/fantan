<script lang="ts">
	//@ts-nocheck
	import { browser, dev } from '$app/environment';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { pb, turnstileJwt } from '$lib/stores/pocketbase';
	import { mode } from 'mode-watcher';

	export let show = false;
	export let id = 'turnstile';

	if (browser) {
		window.onLoadTurnstile = () => {
			turnstile.render(`#${id}`, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				theme: $mode,
				appearance: show ? 'always' : 'interaction-only',
				size: 'flexible',
				callback: async (token: string) => {
					if (dev) console.log('turnstile token:', token);
					const result = await pb.send('/c/turnstile-verify', {
						method: 'POST',
						body: JSON.stringify({ token })
					});
					$turnstileJwt = result.jwt;
				}
			});
		};
	}
</script>

<svelte:head>
	<script
		src={`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onLoadTurnstile`}
	></script>
</svelte:head>

<div class={`w-full ${$$props.class ?? ''}`} {id} />
