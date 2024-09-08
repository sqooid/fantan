<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/shadcn/components/ui/button';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';

	$: path = $page.url.pathname;
	export let href: string;
	export let altPaths: string[] = [];
</script>

<Button {href} variant={path === href || altPaths.includes(path) ? 'outline' : 'ghost'}>
	<slot />
</Button>

<style lang="postcss">
</style>
