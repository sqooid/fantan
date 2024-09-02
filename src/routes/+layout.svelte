<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import '../app.postcss';
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

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	hljs.registerLanguage('markdown', markdown);
	storeHighlightJs.set(hljs);
	initializeStores();
	const queryClient = new QueryClient();

	setMode('dark');
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');
	</style>
</svelte:head>

<ModeWatcher />
<QueryClientProvider client={queryClient}>
	<Toaster />
	<div class="grid h-screen grid-rows-[auto_1fr_auto]">
		<!-- Header -->
		<Header />
		<!-- Grid Column -->
		<div class="grid grid-cols-1 md:grid-cols-[auto_1fr_auto]">
			<!-- Sidebar (Left) -->
			<aside class=" p-4">(sidebar)</aside>
			<!-- Main -->
			<main class="p-4 space-y-4">
				<slot />
			</main>
			<!-- Sidebar (Right) -->
			<aside class=" p-4">(sidebar)</aside>
		</div>
		<!-- Footer -->
		<!-- <footer class="bg-blue-500 p-4">(footer)</footer> -->
	</div>
</QueryClientProvider>
