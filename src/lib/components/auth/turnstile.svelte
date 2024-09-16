<script lang="ts">
	//@ts-nocheck
	import { browser, dev } from '$app/environment';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { mode } from 'mode-watcher';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';

	export let show = false;
	export let id = 'turnstile';

	const dispatch = createEventDispatcher();

	if (browser) {
		window.onLoad = () => {
			turnstile.render(`#${id}`, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				theme: $mode,
				appearance: show ? 'always' : 'interaction-only',
				size: 'flexible',
				callback: (token: string) => {
					if (dev) console.log('turnstile token:', token);
					dispatch('token', token);
				}
			});
		};
	}
</script>

<svelte:head>
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onLoad"
	></script>
</svelte:head>

<div class={`w-full ${$$props.class ?? ''}`} {id} />
