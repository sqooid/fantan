<script lang="ts">
	import * as Accordion from '$lib/shadcn/components/ui/accordion';
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Dialog from '$lib/shadcn/components/ui/dialog';
	import { Input } from '$lib/shadcn/components/ui/input';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import GlobalLoadingBar from '../global-loading-bar.svelte';
	import { parseMdContent, parseMdFootnotes, parseMdStructure } from './transforms';
	import Checkbox from '$lib/shadcn/components/ui/checkbox/checkbox.svelte';
	import type { ChaptersResponse } from '$lib/pocketbase-types';
	import { TriangleAlert } from 'lucide-svelte';
	import MassImportSettings from './mass-import-settings.svelte';
	import { defaultSettings as defaultImportSettings } from './mass-import-settings.svelte';
	import { ClientResponseError } from 'pocketbase';

	export let novelId: string;
	export let existingChapters: ChaptersResponse[];

	const chapterExists = (volume: string, value: string) => {
		return existingChapters.some(
			(chapter) => chapter.volume.toString() === volume && chapter.value === value
		);
	};

	let markdown = '';
	let open = false;

	const importSettings = { ...defaultImportSettings };

	const queryClient = useQueryClient();

	let chapters: {
		title: string;
		value: string;
		volume: string;
		content: string;
		footnotes: Record<string, string>;
		import: boolean;
	}[] = [];

	const onParse = () => {
		try {
			// checks
			if (!importSettings.volumeRegex || !importSettings.chapterRegex) {
				toast.error('Volume and chapter regex must be set');
				return;
			}
			if (importSettings.noteText === 'custom' && /[\s@]+/.test(importSettings.customNoteText)) {
				toast.error('Custom note text must cannot contain spaces or @');
				return;
			}
			chapters = [];
			const { volumes, footnoteLines } = parseMdStructure(markdown, importSettings);
			const footnotes = parseMdFootnotes(footnoteLines);
			volumes.forEach((volume) => {
				volume.chapters.forEach((chapter) => {
					const newChapter = parseMdContent(chapter.lines.join('\n'), footnotes, importSettings);
					chapters.push({
						title: chapter.title,
						volume: volume.value,
						value: chapter.value,
						content: newChapter.content,
						footnotes: newChapter.footnotes,
						import: !chapterExists(volume.value, chapter.value)
					});
				});
			});
			chapters = chapters;
			toast.success('Successfully parsed markdown');
		} catch (error) {
			toast.error('Failed to parse markdown');
		}
	};

	let loading = false;
	const importMutation = useMutation(
		async () => {
			let created = 0;
			let updated = 0;
			let failed = 0;
			const results = chapters
				.filter((chapter) => chapter.import)
				.map(async (chapter) => {
					const chapterData = {
						novel: novelId,
						title: chapter.title,
						volume: chapter.volume,
						value: chapter.value,
						content: { source: '', translated: chapter.content },
						notes: chapter.footnotes
					};
					const exists = await pb
						.collection('chapters')
						.getFirstListItem(
							pb.filter('novel = {:novelId} && volume = {:volume} && value = {:chapter}', {
								novelId,
								volume: chapter.volume,
								chapter: chapter.value
							}),
							{ fields: 'id' }
						)
						.catch((error) => {
							if (error instanceof ClientResponseError && error.status === 404) {
								return null;
							}
						});
					// overwrite
					try {
						if (exists) {
							await pb.collection('chapters').update(exists.id, chapterData, { requestKey: null });
							updated += 1;
						}
						// create new
						else {
							await pb.collection('chapters').create(chapterData, { requestKey: null });
							created += 1;
						}
					} catch (error) {
						failed += 1;
					}
				});
			await Promise.allSettled(results);
			toast.success(`Created ${created} chapters, updated ${updated} chapters`);
			if (failed) {
				toast.error(`Failed to create ${failed} chapters`);
			}
		},
		{
			onError(error, variables, context) {
				console.log(error);
				toast.error('Failed to import chapters');
			},
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['chapters', { novel: novelId }]);
			},
			onSettled(data, error, variables, context) {
				loading = false;
				open = false;
			}
		}
	);
	const onImport = async () => {
		loading = true;
		$importMutation.mutate();
	};

	const onInputFile = (event: InputEvent) => {
		const target = event.target as HTMLInputElement;
		if (!target?.files) return;
		const file = target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			markdown = e.target?.result as string;
			onParse();
		};
		reader.readAsText(file);
	};
</script>

{#if loading}
	<GlobalLoadingBar />
{/if}
<Dialog.Root bind:open>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Mass import</Button>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto max-w-4xl">
		<Dialog.Header>
			<Dialog.Title>Mass import from markdown</Dialog.Title>
			<Dialog.Description>
				Import chapters from a markdown file. The file should be formatted as follows:
				<div class="my-2">
					<code>
						# Book 1
						<br />
						## Chapter 1 - Title
						<br />
						Text[^1]
						<br />
						[^1]: Footnote
					</code>
				</div>
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<!-- <Textarea placeholder="Paste markdown here" bind:value={markdown} /> -->
			<Input type="file" accept=".md" on:input={onInputFile} />
			<MassImportSettings settings={importSettings} />
			<Button on:click={onParse}>Parse</Button>
			{#if chapters.length}
				<Accordion.Root>
					{#each chapters as chapter}
						<Accordion.Item value={`${chapter.volume}-${chapter.value}`}>
							<Accordion.Trigger>
								<div class="flex gap-4 items-center">
									<button on:click|stopPropagation>
										<Checkbox bind:checked={chapter.import} />
									</button>
									{#if chapterExists(chapter.volume, chapter.value)}
										<div class="muted text-destructive flex gap-2 items-center">
											<TriangleAlert class="w-4 h-4" />
											Overwrite
										</div>
									{/if}
									Volume {chapter.volume} | Chapter {chapter.value} - {chapter.title || 'No title'}
								</div>
							</Accordion.Trigger>
							<Accordion.Content>
								<div class="whitespace-pre-wrap">
									<span class="large">Text</span><br />
									<code>
										{chapter.content}
									</code>
									<span class="large">Notes</span><br />
									<code>
										{JSON.stringify(chapter.footnotes, null, 2)}
									</code>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
				<Button on:click={onImport} variant="default">Import</Button>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style lang="postcss">
</style>
