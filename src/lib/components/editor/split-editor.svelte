<script lang="ts">
	import PlusIcon from '$lib/icons/plus-icon.svelte';
	import RichButton from '../inputs/rich-button.svelte';
	import type { ChapterContent } from './content-types';
	import SplitEditorSection from './split-editor-section.svelte';
	import { cloneDeep, debounce } from 'lodash-es';

	export let content: ChapterContent = { sections: [] };

	let sections = content.sections;

	const onCreateSectionBottom = () => {
		sections.push({ source: '', translated: '' });
		sections = sections;
		onSaveSection();
	};

	const history = [cloneDeep(sections)];

	let saving = false;
	const onSaveSection = () => {
		saving = true;
		debouncedSave.cancel();
		history.push(cloneDeep(sections));
		console.log('saved history');
		console.log(history);
		tainted = false;
		saving = false;
	};

	const debouncedSave = debounce(() => {
		onSaveSection();
	}, 1000);

	// force dom to update on undo
	let versionKey = 0;

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'z' && e.ctrlKey && !tainted) {
			if (history.length > 1) {
				console.log('history undo');

				e.preventDefault();
				history.pop();
				const restored = history.pop();
				console.log(history);
				console.log(restored);
				sections = restored as any;
				versionKey++;
			}
		}
	};

	let tainted = false;
	const onSectionInput = () => {
		tainted = true;
		debouncedSave();
	};
</script>

<svelte:document on:keydown={onKeyDown} />

<div class="w-full flex flex-col gap-4">
	<div class="grid grid-cols-2 max-w-full gap-x-2 gap-y-12 py-12">
		{#key versionKey}
			{#each sections as section}
				<SplitEditorSection
					bind:text={section.source}
					on:saveSection={onSaveSection}
					on:input={onSectionInput}
				/>
				<SplitEditorSection
					bind:text={section.translated}
					on:saveSection={onSaveSection}
					on:input={onSectionInput}
				/>
			{:else}
				<span>No sections</span>
			{/each}
		{/key}
	</div>
	<RichButton
		class="variant-filled flex gap-2 w-fit outline-none border-none"
		on:click={onCreateSectionBottom}
	>
		<PlusIcon class="h-4" />
		Section
	</RichButton>
</div>
