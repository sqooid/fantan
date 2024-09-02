<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { cloneDeep, debounce } from 'lodash-es';
	import { Plus } from 'lucide-svelte';
	import type { ChapterContent, ChapterSection } from './content-types';
	import SplitEditorSection from './split-editor-section.svelte';

	export let sections: ChapterSection[] = [];
	export let tainted = false;

	export const getSections = () => sections;

	const onCreateSectionBottom = () => {
		sections.push({ source: '', translated: '' });
		sections = sections;
		saveHistory('bottom');
	};

	const history = [cloneDeep(sections)];

	let saving = false;
	const saveHistory = (trigger = '') => {
		saving = true;
		debouncedSave.cancel();
		history.push(cloneDeep(sections));
		console.log(trigger, JSON.stringify(history));

		activeField = false;
		saving = false;
	};

	const debouncedSave = debounce(() => {
		saveHistory('active');
	}, 1000);

	// force dom to update on undo
	let versionKey = 0;

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'z' && e.ctrlKey && !activeField) {
			if (history.length > 0) {
				e.preventDefault();

				history.pop();
				const restored = cloneDeep(history[history.length - 1]);
				console.log('undo', restored);

				sections = restored as any;
				++versionKey;
			}
		}
	};

	let activeField = false;
	const onSectionInput = () => {
		activeField = true;
		tainted = true;
		debouncedSave();
	};

	const onEnter = (sectionIndex: number, offset: number, side: 'source' | 'translated') => {
		if (activeField) {
			saveHistory('enter-active');
		}
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
		sections[sectionIndex + 1] = nextSection;
		sections[sectionIndex] = section;
		saveHistory('enter');
	};

	const onFocusOut = () => {
		if (activeField) {
			saveHistory('focus-out');
		}
	};
</script>

<svelte:document on:keydown={onKeyDown} />

<div class="w-full flex flex-col gap-4 pt-6">
	<div class="grid grid-cols-2 max-w-full gap-x-16 gap-y-8 py-8">
		{#key versionKey}
			{#each sections as section, i}
				<SplitEditorSection
					bind:text={section.source}
					on:saveSection={onFocusOut}
					on:input={onSectionInput}
					on:enter={(o) => onEnter(i, o.detail.offset, 'source')}
				/>
				<SplitEditorSection
					bind:text={section.translated}
					on:saveSection={onFocusOut}
					on:input={onSectionInput}
					on:enter={(o) => onEnter(i, o.detail.offset, 'translated')}
				/>
			{:else}
				<span class="w-full text-center col-span-2 text-sm font-medium leading-none">
					No sections
				</span>
			{/each}
		{/key}
	</div>
	<Button on:click={onCreateSectionBottom} variant="outline">
		<Plus class="h-4 w-4" />
		Section
	</Button>
</div>
