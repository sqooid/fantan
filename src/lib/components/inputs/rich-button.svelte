<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let loading = false;
</script>

<button type="button" class={`btn relative overflow-hidden ${$$props.class ?? ''}`} on:click>
	<slot />
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/50">
			<ProgressRadial width="w-6" />
		</div>
	{/if}
</button>
