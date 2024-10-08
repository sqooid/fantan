<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import '../global.postcss';
	// Highlight JS
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import markdown from 'highlight.js/lib/languages/markdown';
	import 'highlight.js/styles/github-dark.css';
	// Floating UI for Popups
	import Header from '$lib/components/header.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Toaster } from '$lib/shadcn/components/ui/sonner';
	import { isMobile } from '$lib/stores/breakpoints';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@sveltestack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import { generateMetaProps } from '$lib/utils/data-transform';
	import { merge } from 'lodash-es';
	import { MetaTags } from 'svelte-meta-tags';
	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	import type { LayoutData } from './$types';
	import Turnstile from '$lib/components/auth/turnstile.svelte';
	import { authStore, turnstileJwt } from '$lib/stores/pocketbase';
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';

	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	hljs.registerLanguage('markdown', markdown);
	storeHighlightJs.set(hljs);
	initializeStores();
	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	$: metaTags = generateMetaProps(merge({}, data.baseMetaTags, $page.data.pageMetaTags));

	$: redirect = $page.url.searchParams.get('redirect');
	$: if (browser && $authStore?.isValid && ['/login', '/register'].includes($page.url.pathname)) {
		if (redirect) {
			console.log('redirecting to', redirect);
			goto(redirect);
		} else {
			goto('/');
		}
	}

	if (browser && !dev) {
		// disable logs in production on browser
		console.log = () => {};
		console.debug = () => {};
		console.warn = () => {};
		console.info = () => {};
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+SC:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif+JP:wght@200..900&family=Noto+Serif+SC:wght@200..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	{@html webManifestLink}
</svelte:head>

<MetaTags {...metaTags} />

<ModeWatcher />
<QueryClientProvider client={data.queryClient}>
	<Toaster />
	<!-- <div class="grid grid-rows-[auto_1fr_auto]"> -->
	<!-- Header -->
	<Header />
	<!-- Grid Column -->
	<div class="w-full mt-16">
		{#if !$isMobile}
			<Breadcrumb />
		{/if}
		<!-- Sidebar (Left) -->
		<!-- <aside class=" p-4">(sidebar)</aside> -->
		<!-- Main -->
		<main class="px-4 pt-4 space-y-4 w-full">
			<!-- {#key data.url}
					<div in:blur={{ delay: 1 }} out:blur={{ duration: 1 }} class="absolute"> -->
			<div class="md:px-8 max-w-full">
				<slot />
			</div>
			<!-- </div>
				{/key} -->
		</main>
		<!-- Sidebar (Right) -->
		<!-- <aside class=" p-4">(sidebar)</aside> -->
	</div>
	<!-- Footer -->
	<!-- <footer class="bg-blue-500 p-4">(footer)</footer> -->
	<!-- </div> -->
</QueryClientProvider>
{#if !$turnstileJwt && $page.url.pathname !== '/register'}
	<Turnstile verify />
{/if}
