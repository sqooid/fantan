<script lang="ts" context="module">
	type Settings = {
		volumeRegex: string;
		chapterRegex: string;
		noteText: 'original' | 'number' | 'custom';
		customNoteText: string;
	};
	export const defaultSettings: Settings = {
		volumeRegex: String.raw`#\s+Book\s+(\d+).*`,
		chapterRegex: String.raw`##\s+Chapter\s+(\d+)\s+\\-\s+(.+)`,
		noteText: 'number',
		customNoteText: 'note'
	};
</script>

<script lang="ts">
	import { Input } from '$lib/shadcn/components/ui/input';
	import { Label } from '$lib/shadcn/components/ui/label';
	import * as Select from '$lib/shadcn/components/ui/select';
	import * as Collapsible from '$lib/shadcn/components/ui/collapsible';
	import type { Selected } from 'bits-ui';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { ChevronsUpDown } from 'lucide-svelte';

	export let settings: Settings = { ...defaultSettings };

	const noteTextOptions = [
		{ value: 'original', label: 'Original (use value from markdown)' },
		{ value: 'number', label: 'Number (1,2,3...)' },
		{ value: 'custom', label: 'Custom (use custom string)' }
	];

	const onNoteTextChange = (e: Selected<string> | undefined) => {
		if (e) {
			settings.noteText = e.value as any;
		}
	};
</script>

<Collapsible.Root>
	<Collapsible.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="sm" class="flex items-center gap-2">
			<h4 class="h4">Import settings</h4>
			<ChevronsUpDown class="h-4 w-4" />
			<span class="sr-only">Toggle</span>
		</Button>
	</Collapsible.Trigger>
	<Collapsible.Content>
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-2">
				<div class="">
					<Label for="volume-regex">Volume Regex</Label>
					<Input bind:value={settings.volumeRegex} id="volume-regex" />
				</div>
				<div class="">
					<Label for="chapter-regex">Chapter Regex</Label>
					<Input bind:value={settings.chapterRegex} id="chapter-regex" />
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div>
					<Label for="note-text">Footnote text</Label>
					<Select.Root selected={noteTextOptions[1]} onSelectedChange={onNoteTextChange}>
						<Select.Trigger class="">
							<Select.Value placeholder="" id="note-text" />
						</Select.Trigger>
						<Select.Content>
							{#each noteTextOptions as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				{#if settings.noteText == 'custom'}
					<div>
						<Label for="custom-note-text">Custom footnote text</Label>
						<Input bind:value={settings.customNoteText} id="custom-note-text" />
					</div>
				{/if}
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
