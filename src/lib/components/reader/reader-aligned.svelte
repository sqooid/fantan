<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let sourceContent: string;
	export let translatedContent: string;

	const dispatch = createEventDispatcher<{ openNote: string }>();
</script>

<style lang="postcss">
</style>
