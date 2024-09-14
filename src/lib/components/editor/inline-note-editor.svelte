<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import * as Tooltip from '$lib/shadcn/components/ui/tooltip';

	import { pb } from '$lib/stores/pocketbase';
	import {
		defaultValueCtx,
		Editor,
		editorViewCtx,
		rootCtx,
		rootDOMCtx,
		serializerCtx
	} from '@milkdown/kit/core';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { listener } from '@milkdown/kit/plugin/listener';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { brackets } from './brackets-plugin';
	import { addEventListeners } from './event-listeners';
	import { Info } from 'lucide-svelte';

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
				queryClient.invalidateQueries(['notes', { chapterId }]);
				open = false;
			},
			onError(error, variables, context) {
				toast.error('Failed to save note');
			}
		}
	);

	let tainted = false;
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
				addEventListeners(e, {
					onEmptyChange: (v) => {
						showPlaceholder = v;
					},
					onInteraction: () => {
						tainted = true;
					}
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
		if (!tainted) return;
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
			<Drawer.Title class="flex items-center gap-2">
				Edit inline note
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button builders={[builder]} variant="ghost">
							<Info class="w-4 h-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content class="flex flex-col gap-2 p-4">
						<span>Content is saved automatically.</span>
						<span>URL's will be automatically converted to links.</span>
					</Tooltip.Content>
				</Tooltip.Root>
			</Drawer.Title>
		</Drawer.Header>
		<div class="p-12">
			<div use:editor class=" relative">
				{#if showPlaceholder}
					<span class="absolute text-lg pointer-events-none opacity-30 top-0 left-0">
						Note...
					</span>
				{/if}
			</div>
			<!-- <Button on:click={onSave}>Save changes</Button> -->
		</div></Drawer.Content
	>
</Drawer.Root>
