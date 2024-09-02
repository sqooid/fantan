<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/shadcn/components/ui/button';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';

	$: path = $page.url.pathname;
	export let href: string;
</script>

<Button {href} variant={path === href ? 'outline' : 'ghost'}>
	<slot />
</Button>

<style lang="postcss">
</style>
