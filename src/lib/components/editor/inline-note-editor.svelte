<script lang="ts">
	import { history } from '@milkdown/kit/plugin/history';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import {
		defaultValueCtx,
		Editor,
		editorViewCtx,
		rootCtx,
		rootDOMCtx,
		serializerCtx
	} from '@milkdown/kit/core';
	import { listenerCtx, listener } from '@milkdown/kit/plugin/listener';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { debounce } from 'lodash-es';
	import { createEventDispatcher } from 'svelte';
	import { brackets } from './brackets-plugin';
	import { inlineNoteSerializer, inlineNotePlugin } from './note-plugin';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { useMutation, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { pb } from '$lib/stores/pocketbase';
	import { toast } from 'svelte-sonner';
	import type { HTML } from 'mdast';

	export let open = false;
	export let chapterId: string;
	export let noteId: string;
	export let initialNotes: Record<string, string>;

	const queryClient = useQueryClient();

	const notesMutation = useMutation(
		async () => {
			const result = await pb.collection('chapters').update(chapterId, { notes: initialNotes });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Note saved');
				queryClient.invalidateQueries(['notes', chapterId]);
				open = false;
			},
			onError(error, variables, context) {
				toast.error('Failed to save note');
			}
		}
	);

	let editorDiv: HTMLElement | null = null;
	let milkdownEditor: Editor | null = null;
	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
				const content = initialNotes[noteId] ?? '';
				ctx.set(defaultValueCtx, content);
				showPlaceholder = content.length === 0;
			})
			.use(commonmark)
			.use(listener)
			.use(history)
			.use(clipboard)
			.use(brackets)
			.create()
			.then((e) => {
				milkdownEditor = e;
				const ctx = e.ctx;
				const root = ctx.get(rootDOMCtx);
				// show/hide placeholder
				root.addEventListener('keydown', () => {
					if (root.innerText === '\n') {
						showPlaceholder = false;
					}
				});
				root.addEventListener('keyup', () => {
					showPlaceholder = root.innerText === '\n';
				});
			});
	};

	const getMarkdown = () => {
		return milkdownEditor?.action((ctx) => {
			const editorView = ctx.get(editorViewCtx);
			const serializer = ctx.get(serializerCtx);
			return serializer(editorView.state.doc);
		});
	};

	const onSave = () => {
		const markdown = getMarkdown();
		if (!markdown) return;
		initialNotes[noteId] = markdown;
		$notesMutation.mutate();
	};

	$: if (!open && noteId) {
		onSave();
	}

	let showPlaceholder = true;
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger></Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Edit inline note</Drawer.Title>
		</Drawer.Header>
		<div class="p-8">
			<div use:editor class="h-32 relative" bind:this={editorDiv}>
				{#if showPlaceholder}
					<span class="absolute text-lg pointer-events-none opacity-30 top-0 left-0">
						Note...
					</span>
				{/if}
			</div>
			<Button on:click={onSave}>Save changes</Button>
		</div></Drawer.Content
	>
</Drawer.Root>
