<script lang="ts">
	import { initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	// Highlight JS
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import xml from 'highlight.js/lib/languages/xml';
	import 'highlight.js/styles/github-dark.css';
	// for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	// Floating UI for Popups
	import Header from '$lib/components/header.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();
	const queryClient = new QueryClient();
</script>

<Toast />
<Modal />
<QueryClientProvider client={queryClient}>
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
		<footer class="bg-blue-500 p-4">(footer)</footer>
	</div>
</QueryClientProvider>
