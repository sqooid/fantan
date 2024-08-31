<script lang="ts">
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
	export let href: string;
	export let name: string;
</script>

<a
	type="button"
	class={`btn cursor-pointer ${$$props.class ?? ''} ${path === href ? 'variant-ghost' : ''}`}
	{href}>{name}</a
>

<style lang="postcss">
</style>
