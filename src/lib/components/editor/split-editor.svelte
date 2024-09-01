<script lang="ts">
	import PlusIcon from '$lib/icons/plus-icon.svelte';
	import RichButton from '../inputs/rich-button.svelte';
	import type { ChapterContent } from './content-types';
	import SplitEditorSection from './split-editor-section.svelte';
	import { cloneDeep, debounce } from 'lodash-es';

	export let content: ChapterContent = { sections: [] };

	export const getSections = () => sections;

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
		consecutiveUndo = false;
		saving = false;
	};

	const debouncedSave = debounce(() => {
		onSaveSection();
	}, 1000);

	// force dom to update on undo
	let versionKey = 0;

	let consecutiveUndo = false;
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'z' && e.ctrlKey && !tainted) {
			if (history.length > 0) {
				e.preventDefault();
				console.log('history undo');

				if (!consecutiveUndo) {
					history.pop();
				}
				let restored;
				if (history.length > 1) {
					restored = history.pop();
				} else {
					restored = cloneDeep(history[0]);
				}

				console.log(history);
				console.log(restored);
				sections = restored as any;
				versionKey++;
				consecutiveUndo = true;
			}
		}
	};

	let tainted = false;
	const onSectionInput = () => {
		consecutiveUndo = false;
		tainted = true;
		debouncedSave();
	};

	const onEnter = (sectionIndex: number, offset: number, side: 'source' | 'translated') => {
		const section = sections[sectionIndex];
		const text = section[side];
		const beforeText = text.slice(0, offset + 1);
		const afterText = text.slice(offset);
		const newSection: typeof section = { source: '', translated: '' };
		newSection[side] = afterText;
		section[side] = beforeText;
		sections.splice(sectionIndex + 1, 0, newSection);
		sections = sections;
		onSaveSection();
	};
</script>

<svelte:document on:keydown={onKeyDown} />

<div class="w-full flex flex-col gap-4">
	<div class="grid grid-cols-2 max-w-full gap-x-2 gap-y-12 py-12">
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
