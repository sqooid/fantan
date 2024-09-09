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

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	hljs.registerLanguage('markdown', markdown);
	storeHighlightJs.set(hljs);
	initializeStores();
	const queryClient = new QueryClient();
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');
	</style>
	<title>Fantan</title>
</svelte:head>

<ModeWatcher />
<QueryClientProvider client={queryClient}>
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
