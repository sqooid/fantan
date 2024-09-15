<script lang="ts">
	import { browser } from '$app/environment';
	import { markdownText } from '$lib/utils/data-transform';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let descriptionText = '';
	let title = `Fantan | ${data.novelTitle}`;
	if (!browser) {
		descriptionText = markdownText(data.description);
	}
</script>

<svelte:head>
	{#if !browser}
		<title>Fantan | {data.novelTitle}</title>
		<meta name="description" content={descriptionText} />
		<meta property="og:site_name" content="Fantan" />
		<!-- facebook meta tags -->
		<meta property="og:title" content={title} />
		<meta property="og:description" content={descriptionText} />
		<meta property="og:type" content="website" />
		<meta property="og:url" content={data.url} />
		<meta property="og:image" content={data.cover} />
		<!-- twitter meta tags -->
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={descriptionText} />
		<meta name="twitter:image" content={data.cover} />
		<meta name="twitter:image:alt" content={`Cover image of ${data.novelTitle}`} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<slot />
