<script lang="ts">
	export let keys: string[] = [];
</script>

<span class="text-sm font-medium leading-none self-center"><slot /></span>
<div class="flex gap-1">
	{#each keys as k}
		<kbd>{k}</kbd>
	{/each}
</div>
