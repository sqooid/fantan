<script lang="ts">
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import Switch from '$lib/shadcn/components/ui/switch/switch.svelte';
	import { rawToSectioned, sectionedToRaw } from '$lib/utils/content';
	import type { ChapterContent, ChapterSection } from './content-types';
	import SplitEditorRaw from './split-editor-raw.svelte';
	import SplitEditorSectioned from './split-editor-sectioned.svelte';

	export let content: ChapterSection;
	export let tainted = false;

	export const getContent = () => editor.getContent();

	let editor: SplitEditorRaw;
</script>

<div class="w-full flex flex-col gap-4">
	<SplitEditorRaw {content} bind:tainted bind:this={editor} />
</div>
