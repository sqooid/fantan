<script lang="ts">
	import PlusIcon from '$lib/icons/plus-icon.svelte';
	import RichButton from '../inputs/rich-button.svelte';
	import type { ChapterContent } from './content-types';
	import SplitEditorSection from './split-editor-section.svelte';
	import { cloneDeep, debounce } from 'lodash-es';

	export let content: ChapterContent = { sections: [] };

	export const getSections = () => sections;

	let sections = content.sections;
	let textContainer: HTMLElement;

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
			if (history.length > 0) {
				e.preventDefault();

				history.pop();
				const restored = cloneDeep(history[history.length - 1]);

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

	const onEnter = (sectionIndex: number, offset: number, side: 'source' | 'translated') => {
		const section = sections[sectionIndex];
		const text = section[side];
		const beforeText = text.slice(0, offset);
		const afterText = text.slice(offset);
		let nextSection = sections[sectionIndex + 1];
		// if next section is empty, move to that instead of creating a new section
		const createNew = !nextSection || nextSection[side];
		if (createNew) {
			nextSection = { source: '', translated: '' };
		}
		nextSection[side] = afterText;
		section[side] = beforeText;
		if (createNew) {
			sections.splice(sectionIndex + 1, 0, nextSection);
		}
		sections = sections;
		onSaveSection();
	};
</script>

<svelte:document on:keydown={onKeyDown} />

<div class="w-full flex flex-col gap-4">
	<div class="grid grid-cols-2 max-w-full gap-x-2 gap-y-12 py-12" bind:this={textContainer}>
		{#key versionKey}
			{#each sections as section, i}
				<SplitEditorSection
					bind:text={section.source}
					on:saveSection={onSaveSection}
					on:input={onSectionInput}
					on:enter={(o) => onEnter(i, o.detail.offset, 'source')}
				/>
				<SplitEditorSection
					bind:text={section.translated}
					on:saveSection={onSaveSection}
					on:input={onSectionInput}
					on:enter={(o) => onEnter(i, o.detail.offset, 'translated')}
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
