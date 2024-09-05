<script lang="ts">
	import type { ChapterSection } from './content-types';
	import SplitEditorRawSideCooked from './split-editor-raw-side-cooked.svelte';

	export let content: ChapterSection;
	export let tainted = false;

	export const getContent = () => {
		return { source: sourceEditor.getText(), translated: targetEditor.getText() };
	};

	const onInput = () => {
		tainted = true;
	};

	let sourceEditor: SplitEditorRawSideCooked;
	let targetEditor: SplitEditorRawSideCooked;
</script>

<div class="w-full flex flex-col gap-4">
	<div class="grid grid-cols-2 w-full gap-x-16 py-8">
		<SplitEditorRawSideCooked
			bind:content={content.source}
			on:input={onInput}
			bind:this={sourceEditor}
		/>
		<SplitEditorRawSideCooked
			bind:content={content.translated}
			on:input={onInput}
			bind:this={targetEditor}
		/>
	</div>
</div>
