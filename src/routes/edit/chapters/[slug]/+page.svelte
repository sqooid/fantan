<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import ChapterListVisibility from '$lib/components/chapter-list-visibility.svelte';
	import CreateChapterModal from '$lib/components/create-chapter-modal.svelte';
	import type { ChapterSection } from '$lib/components/editor/content-types';
	import EditTips from '$lib/components/editor/edit-tips.svelte';
	import InlineNoteEditor from '$lib/components/editor/inline-note-editor.svelte';
	import SplitEditor from '$lib/components/editor/split-editor.svelte';
	import GlobalLoadingBar from '$lib/components/global-loading-bar.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import type { ChaptersResponse, NovelsResponse } from '$lib/pocketbase-types';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import Skeleton from '$lib/shadcn/components/ui/skeleton/skeleton.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';
	import { readerInfo } from '$lib/stores/options';
	import { pb } from '$lib/stores/pocketbase';
	import { chapterToDisplay, chapterToPath } from '$lib/utils/data-transform';
	import { slideBlur } from '$lib/utils/transition';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { blur } from 'svelte/transition';

	$: chapterId = $page.params.slug;

	let editor: SplitEditor;

	$: if ($novelQuery.data && $chapterQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: 'Create', href: '/create' },
			{ title: $novelQuery.data.title, href: `/edit/novels/${$novelQuery.data.id}` },
			{
				title: chapterToDisplay($chapterQuery.data),
				href: `/edit/chapters/${chapterId}`
			}
		];

	const chapterQuery = useQuery<ChaptersResponse>({ enabled: false });
	$: {
		chapterQuery.setOptions({
			enabled: true,
			queryKey: ['chapter', { id: chapterId, full: true }],
			queryFn: async () => {
				const result = await pb.collection('chapters').getOne(chapterId);
				return result;
			}
		});
	}
	const notesQuery = useQuery<ChaptersResponse>({ enabled: false });
	$: {
		notesQuery.setOptions({
			enabled: true,
			queryKey: ['notes', { chapterId: chapterId }],
			queryFn: async () => {
				const result = await pb.collection('chapters').getOne(chapterId, { fields: 'notes' });
				return result;
			}
		});
	}
	$: content = $chapterQuery.data?.content as ChapterSection;
	$: notes = $notesQuery.data?.notes as Record<string, string>;

	const novelQuery = useQuery<NovelsResponse>({ enabled: false });
	$: if ($chapterQuery.data?.novel) {
		novelQuery.setOptions({
			enabled: true,
			queryKey: ['novel', { id: $chapterQuery.data.novel, full: false }],
			queryFn: () => {
				const result = pb
					.collection('novels')
					.getOne($chapterQuery.data?.novel, { fields: 'sourceLanguage,title,id,slug' });
				return result;
			}
		});
	}

	$: if ($novelQuery.data) {
		$readerInfo.language.source = $novelQuery.data.sourceLanguage;
		$readerInfo.language.translated = 'English';
	}

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

	$: {
		chapterQuery.setEnabled(!tainted && !contentTainted);
	}

	beforeNavigate((n) => {
		if (tainted || contentTainted) {
			if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
				n.cancel();
			}
		}
	});
</script>

<div class="flex flex-col w-full gap-4">
	<div class="flex justify-between">
		<div class="flex gap-8 items-center">
			<h1 class="h1">Chapter edit</h1>
			{#if $chapterQuery.data}
				<CreateChapterModal novelId={$chapterQuery.data.novel} />
			{/if}
		</div>
		{#if $chapterQuery.data && $novelQuery.data}
			<div class="flex gap-8 items-center">
				<Button href={chapterToPath($chapterQuery.data, $novelQuery.data.slug)} variant="outline"
					>Preview</Button
				>
				<ChapterListVisibility
					id={$chapterQuery.data.id}
					novelId={$chapterQuery.data.novel}
					published={$chapterQuery.data.published}
				/>
			</div>
		{/if}
	</div>
	<div class="flex w-full flex-col gap-4 transition-all">
		{#if $chapterQuery.data}
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
		{:else}
			<Skeleton class="h-16" />
			<Skeleton class="h-16" />
			<GlobalLoadingBar />
		{/if}
	</div>
	<EditTips />
	{#if $chapterQuery.isSuccess}
		<SplitEditor
			bind:this={editor}
			{content}
			bind:tainted={contentTainted}
			on:editNote={onEditNote}
			sourceLanguage={$novelQuery.data?.sourceLanguage}
		/>
	{:else}
		<div class="flex gap-4">
			<Skeleton class="w-1/2 h-96" />
			<Skeleton class="w-1/2 h-96" />
		</div>
	{/if}
	<div class="w-full p-8">
		{#if contentTainted}
			<div class="fixed left-4 right-4 bottom-4" transition:blur={{ duration: 150 }}>
				<Button on:click={onSaveContent} class="w-full">Save content</Button>
			</div>
		{/if}
	</div>
</div>

<InlineNoteEditor bind:open={showNoteEditor} {chapterId} initialNotes={notes ?? {}} {noteId} />
