<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { Moon, Sun } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<Button on:click={toggleMode} variant="ghost">
	{#if $mode === 'dark'}
		<Moon />
	{:else}
		<Sun />
	{/if}
</Button>
