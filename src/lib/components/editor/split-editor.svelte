<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { ChapterSection } from './content-types';
	import SplitEditorRaw from './split-editor-raw.svelte';

	export let sourceLanguage: string = '';
	export let content: ChapterSection;
	export let tainted = false;

	export const getContent = () => editor.getContent();

	let editor: SplitEditorRaw;
</script>

<div class="w-full flex flex-col gap-4" in:fade={{ duration: 50 }}>
	<SplitEditorRaw {content} bind:tainted bind:this={editor} on:editNote {sourceLanguage} />
</div>
