<script lang="ts">
	import { isMobile } from '$lib/stores/breakpoints';
	import { readerOptions } from '$lib/stores/options';
	import NoteViewer from './note-viewer.svelte';
	import ReaderAligned from './reader-aligned.svelte';
	import ReaderOptions from './reader-options.svelte';
	import ReaderUnaligned from './reader-unaligned.svelte';

	export let sourceContent: string;
	export let translatedContent: string;
	export let notes: Record<string, string>;

	let showNotes = false;
	let noteId = '';

	$: divClass = `${$readerOptions.showSource && !$isMobile ? 'grid grid-cols-2' : ''} w-fit gap-x-8 lg:gap-x-24 mx-auto`;

	const onOpenNote = (e: CustomEvent<string>) => {
		const id = e.detail;
		noteId = id;
		showNotes = true;
	};
</script>

{#if $readerOptions.aligned && $readerOptions.showSource && !$isMobile}
	<ReaderAligned {sourceContent} {translatedContent} on:openNote={onOpenNote} />
{:else}
	<div class={divClass}>
		{#if $readerOptions.showSource}
			<ReaderUnaligned content={sourceContent} on:openNote={onOpenNote} />
		{/if}
		{#if !$isMobile || !$readerOptions.showSource}
			<ReaderUnaligned content={translatedContent} on:openNote={onOpenNote} />
		{/if}
	</div>
{/if}
<NoteViewer {notes} bind:open={showNotes} {noteId} />
