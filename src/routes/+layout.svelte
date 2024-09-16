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
	import { Toaster } from '$lib/shadcn/components/ui/sonner';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { isMobile } from '$lib/stores/breakpoints';
	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';

	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	hljs.registerLanguage('markdown', markdown);
	storeHighlightJs.set(hljs);
	initializeStores();
	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	let metaDescription = 'Read unofficial translations of web novels';
	let metaLogo = `${data.origin}/fantan.png`;
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+SC:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif+JP:wght@200..900&family=Noto+Serif+SC:wght@200..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	{@html webManifestLink}
	<title>Fantan</title>
	<meta name="description" content={metaDescription} />
	{#if !browser && !data.path.startsWith('/read')}
		<meta property="og:site_name" content="Fantan" />
		<!-- facebook meta tags -->
		<meta property="og:title" content="Fantan" />
		<meta property="og:description" content={metaDescription} />
		<meta property="og:type" content="website" />
		<meta property="og:url" content={data.url} />
		<meta property="og:image" content={metaLogo} />
		<meta property="og:logo" content={metaLogo} />
		<!-- twitter meta tags -->
		<meta name="twitter:title" content="Fantan" />
		<meta name="twitter:description" content={metaDescription} />
		<meta name="twitter:image" content={metaLogo} />
		<meta name="twitter:image:alt" content="Fantan logo" />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

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
