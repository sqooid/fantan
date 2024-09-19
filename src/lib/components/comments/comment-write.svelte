<script lang="ts">
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { Editor, rootCtx } from '@milkdown/kit/core';
	import UserAvatar from './user-avatar.svelte';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { onDestroy } from 'svelte';
	import { addEventListeners, renderMilkdown } from '../editor/event-listeners';
	import { emojiPlugin } from './emoji-plugin';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { useMutation } from '@sveltestack/svelte-query';
	import { replaceAll } from '@milkdown/kit/utils';
	import { toast } from 'svelte-sonner';

	export let chapterId: string;

	$: avatar = $authStore?.model?.avatar;
	$: loggedIn = $authStore?.isValid;

	let showPlaceholder = true;

	let milkdownEditor: Editor | null = null;

	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
			})
			.use(commonmark)
			.use(clipboard)
			.use(history)
			.use(emojiPlugin)
			.create()
			.then((editor) => {
				milkdownEditor = editor;
				addEventListeners(editor, {
					onEmptyChange(value) {
						showPlaceholder = value;
					}
				});
			});
	};
	onDestroy(() => {
		milkdownEditor?.destroy();
	});

	const commentMutation = useMutation(
		async (content: string) => {
			const id = $authStore?.model?.id;
			if (!id) return;
			const result = await pb.collection('chapterComments').create({
				chapter: chapterId,
				user: id,
				content
			});
			return result;
		},
		{
			onSuccess(data, variables, context) {
				milkdownEditor?.action(replaceAll(''));
				showPlaceholder = true;
				toast.success('Comment posted');
			},
			onError(error, variables, context) {
				toast.error('Failed to post comment');
			}
		}
	);

	const onPost = () => {
		if (milkdownEditor === null) return;
		$commentMutation.mutate(renderMilkdown(milkdownEditor));
	};
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={avatar} />
	{#if loggedIn}
		<div>
			<div use:editor class="milkdown p-4 border border-solid rounded-md relative mb-4">
				{#if showPlaceholder}
					<div class="absolute pointer-events-none opacity-30 inset-0 flex items-center pl-4">
						<span>Write a comment</span>
					</div>
				{/if}
			</div>
			<Button on:click={onPost}>Post comment</Button>
		</div>
	{:else}
		<div class="h-full flex items-center">
			<span>
				<a href="/login" class="anchor">Log in</a> to start commenting
			</span>
		</div>
	{/if}
</div>
