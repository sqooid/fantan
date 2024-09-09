<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	export let href: string | undefined = undefined;
</script>

<Button {href} variant="ghost" class={`w-full large ${$$props.class ?? ''}`} on:click
	><slot /></Button
>
