<script lang="ts">
	import { page } from '$app/stores';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import EditTips from '$lib/components/editor/edit-tips.svelte';
	import InlineNoteEditor from '$lib/components/editor/inline-note-editor.svelte';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { slideBlur } from '$lib/utils/transition';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { blur } from 'svelte/transition';

	const chapterId = $page.params.slug;

	let editor: SplitEditor;

	const chapterQuery = useQuery(['chapter', chapterId], () => {
		const result = pb.collection('chapters').getOne(chapterId);
		return result;
	});
	const notesQuery = useQuery(['notes', chapterId], () => {
		const result = pb.collection('chapters').getOne(chapterId, { fields: 'notes' });
		return result;
	});
	$: content = $chapterQuery.data?.content as ChapterSection;
	$: notes = $notesQuery.data?.notes as Record<string, string>;

	$: info = {
		value: $chapterQuery.data?.value ?? '',
		title: $chapterQuery.data?.title ?? ''
	};
	let errors = null;
	const saveInfoMutation = useMutation(
		async () => {
			const result = await pb.collection('chapters').update(chapterId, info);
			return result;
		},
		{
			onSuccess(data, variables, context) {
				tainted = false;
				toast.success('Saved changes');
			},
			onError(error, variables, context) {
				toast.error('Failed to save changes');
			}
		}
	);

	const saveContentMutation = useMutation(
		['chapter', chapterId],
		(newContent: ChapterSection) => {
			content = newContent;
			const result = pb.collection('chapters').update(chapterId, { content });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				contentTainted = false;
				toast.success('Saved changes');
			},
			onError(error, variables, context) {
				toast.error('Failed to save changes');
			}
		}
	);

	let tainted = false;
	const onInfoChanged = () => {
		tainted = true;
	};

	const onSaveInfo = () => {
		$saveInfoMutation.mutate();
	};

	let contentTainted = false;
	const onSaveContent = () => {
		const newContent = editor.getContent();
		if (newContent.source === undefined || newContent.translated === undefined) {
			toast.error('Failed to save changes.');
			return null;
		}
		$saveContentMutation.mutate(newContent as ChapterSection);
	};

	let noteId: string = '';
	let showNoteEditor = false;
	const onEditNote = (e: CustomEvent<{ id: string }>) => {
		const { id } = e.detail;
		noteId = id;
		showNoteEditor = true;
	};
</script>

<div class="flex flex-col w-full gap-4">
	{#if $chapterQuery.isSuccess}
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Chapter edit</h1>
		<div class="flex w-full flex-col gap-4 transition-all">
			<ValidatedField
				type="text"
				id="value"
				label="Chapter number"
				placeholder="1.1"
				infoObject={info}
				errorObject={errors}
				on:input={onInfoChanged}
			/>
			<ValidatedField
				type="text"
				id="title"
				label="Chapter title"
				placeholder="New chapter"
				infoObject={info}
				errorObject={errors}
				on:input={onInfoChanged}
			/>
			{#if tainted}
				<div class="w-fit" transition:slideBlur={{ duration: 150 }}>
					<Button on:click={onSaveInfo}>Save changes</Button>
				</div>
			{/if}
		</div>
		<EditTips />
		<SplitEditor
			bind:this={editor}
			{content}
			bind:tainted={contentTainted}
			{chapterId}
			on:editNote={onEditNote}
		/>
		<div class="w-full p-8">
			{#if contentTainted}
				<div class="fixed left-4 right-4 bottom-4" transition:blur={{ duration: 150 }}>
					<Button on:click={onSaveContent} class="w-full">Save content</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<InlineNoteEditor bind:open={showNoteEditor} {chapterId} initialNotes={notes ?? {}} {noteId} />
