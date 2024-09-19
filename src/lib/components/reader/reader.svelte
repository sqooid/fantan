<script lang="ts">
	import { isMobile } from '$lib/stores/breakpoints';
	import { readerInfo, readerOptions } from '$lib/stores/options';
	import { getFonts } from '$lib/utils/content';
	import NoteViewer from './note-viewer.svelte';
	import ReaderAligned from './reader-aligned.svelte';
	import ReaderUnaligned from './reader-unaligned.svelte';

	export let sourceContent: string;
	export let translatedContent: string;
	export let notes: Record<string, string>;

	let showNotes = false;
	let noteId = '';

	$: divClass = `${$isMobile ? 'full' : $readerOptions.showSource ? 'grid grid-cols-2 w-fit' : 'w-fit'} gap-x-8 lg:gap-x-24 mx-auto`;

	const onOpenNote = (e: CustomEvent<string>) => {
		const id = e.detail;
		noteId = id;
		showNotes = true;
	};

	$: fonts = getFonts($readerInfo, $readerOptions);
</script>

<div style={`--sourceFamily:'${fonts.sourceFont}';--translatedFamily:'${fonts.translatedFont}'`}>
	{#if $readerOptions.aligned && $readerOptions.showSource && !$isMobile}
		<ReaderAligned {sourceContent} {translatedContent} on:openNote={onOpenNote} />
	{:else}
		<div class={divClass}>
			{#if $readerOptions.showSource}
				<ReaderUnaligned
					class="font-source"
					content={sourceContent}
					on:openNote={onOpenNote}
					language={$readerInfo.language.source}
				/>
			{/if}
			{#if !$isMobile || !$readerOptions.showSource}
				<ReaderUnaligned
					class="font-translated"
					content={translatedContent}
					on:openNote={onOpenNote}
					language={$readerInfo.language.translated}
				/>
			{/if}
		</div>
	{/if}
</div>
<NoteViewer {notes} bind:open={showNotes} {noteId} />
