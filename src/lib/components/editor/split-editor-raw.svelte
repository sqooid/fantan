<script lang="ts">
	import { fontOptions, editorOptions, readerInfo } from '$lib/stores/options';
	import { getFonts } from '$lib/utils/content';
	import type { ChapterSection } from './content-types';
	import SplitEditorRawSideCooked from './split-editor-raw-side-cooked.svelte';

	export let content: ChapterSection;
	export let tainted = false;
	export let sourceLanguage: string;

	export const getContent = () => {
		return { source: sourceEditor.getText(), translated: targetEditor.getText() };
	};

	const onInput = () => {
		tainted = true;
	};

	let sourceEditor: SplitEditorRawSideCooked;
	let targetEditor: SplitEditorRawSideCooked;

	$: fonts = getFonts($readerInfo, $editorOptions);
</script>

<div class="w-full">
	<div
		class={`${$editorOptions.showSource ? 'grid-cols-2' : 'grid-cols-1'} grid gap-x-8 lg:gap-x-24 py-8 mx-auto`}
		style={`--sourceFamily:'${fonts.sourceFont}';--translatedFamily:'${fonts.translatedFont}'`}
	>
		{#if $editorOptions.showSource}
			<SplitEditorRawSideCooked
				on:editNote
				bind:content={content.source}
				on:input={onInput}
				bind:this={sourceEditor}
				placeholder={sourceLanguage}
				class="font-source justify-self-end"
			/>
		{/if}
		<SplitEditorRawSideCooked
			on:editNote
			bind:content={content.translated}
			on:input={onInput}
			bind:this={targetEditor}
			class="font-translated self-start"
		/>
	</div>
</div>
