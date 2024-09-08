<script lang="ts">
	import NoteViewer from './note-viewer.svelte';
	import ReaderUnaligned from './reader-unaligned.svelte';

	export let sourceContent: string;
	export let translatedContent: string;
	export let notes: Record<string, string>;

	let showNotes = false;
	let noteId = '';
	let showSource = true;

	$: divClass = `${showSource ? 'grid grid-cols-2' : ''} w-full gap-8`;

	const onOpenNote = (e: CustomEvent<string>) => {
		const id = e.detail;
		noteId = id;
		showNotes = true;
	};
</script>

<div class={divClass}>
	<ReaderUnaligned content={sourceContent} on:openNote={onOpenNote} />
	<ReaderUnaligned content={translatedContent} on:openNote={onOpenNote} />
</div>

<NoteViewer {notes} bind:open={showNotes} {noteId} />
