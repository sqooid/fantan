<script lang="ts">
	import { ImageUp } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let src;
	export let alt = '';

	const dispatch = createEventDispatcher<{ input: File }>();

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			dispatch('input', file);
		}
	};
</script>

<div class={`relative rounded-lg overflow-hidden ${$$props.class ?? ''}`}>
	<img {src} {alt} class="max-h-full max-w-full h-auto" />
	<label
		class="absolute inset-0 opacity-0 hover:opacity-50 cursor-pointer transition-opacity bg-black flex flex-col items-center justify-center gap-2"
	>
		<input type="file" accept="image/*" class="sr-only" on:change={onChange} />
		<span class="text-lg font-semibold text-white">Upload image</span>
		<ImageUp class="w-16 h-16 stroke-white" />
	</label>
</div>
