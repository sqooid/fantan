<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Dialog from '$lib/shadcn/components/ui/dialog';
	import * as Accordion from '$lib/shadcn/components/ui/accordion';
	import Textarea from '$lib/shadcn/components/ui/textarea/textarea.svelte';
	import { parseMdContent, parseMdFootnotes, parseMdStructure } from '../md-import/transforms';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import GlobalLoadingBar from '../global-loading-bar.svelte';

	export let novelId: string;

	let markdown = '';
	let open = false;

	const queryClient = useQueryClient();

	let chapters: {
		title: string;
		value: string;
		volume: string;
		content: string;
		footnotes: Record<string, string>;
	}[] = [];

	const onParse = () => {
		chapters = [];
		const { volumes, footnoteLines } = parseMdStructure(markdown);
		const footnotes = parseMdFootnotes(footnoteLines);
		volumes.forEach((volume) => {
			volume.chapters.forEach((chapter) => {
				const newChapter = parseMdContent(chapter.lines.join('\n'), footnotes);
				chapters.push({
					title: chapter.title,
					volume: volume.value,
					value: chapter.value,
					content: newChapter.content,
					footnotes: newChapter.footnotes
				});
			});
		});
		chapters = chapters;
	};

	let loading = false;
	const importMutation = useMutation(
		async () => {
			const results = chapters.map((chapter) => {
				return pb.collection('chapters').create(
					{
						novel: novelId,
						title: chapter.title,
						volume: chapter.volume,
						value: chapter.value,
						content: { source: '', translated: chapter.content },
						notes: chapter.footnotes,
						published: false
					},
					{ requestKey: null }
				);
			});
			await Promise.all(results);
		},
		{
			onError(error, variables, context) {
				console.log(error);

				toast.error('Failed to import chapters');
			},
			onSuccess(data, variables, context) {
				toast.success('Chapters imported');
				queryClient.invalidateQueries(['chapters', { novelId }]);
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
</script>

{#if loading}
	<GlobalLoadingBar />
{/if}
<Dialog.Root bind:open>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Mass import</Button>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Mass import from markdown</Dialog.Title>
			<Dialog.Description>
				Import chapters from a markdown file. The file should be formatted as follows:
				<br />
				<code>
					# Book 1
					<br />
					## Chapter 1 - Title
					<br />
					Text[^1]
					<br />
					[^1]: Footnote
				</code>
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<Textarea placeholder="Paste markdown here" bind:value={markdown} />
			<Button on:click={onParse}>Parse</Button>
			{#if chapters.length}
				<Accordion.Root>
					{#each chapters as chapter}
						<Accordion.Item value={`${chapter.volume}-${chapter.value}`}>
							<Accordion.Trigger
								>Volume {chapter.volume} | Chapter {chapter.value} - {chapter.title ||
									'No title'}</Accordion.Trigger
							>
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
