<script lang="ts">
	import type { ChapterCommentsResponse } from '$lib/pocketbase-types';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { Editor, rootCtx } from '@milkdown/kit/core';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { replaceAll } from '@milkdown/kit/utils';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { addEventListeners, renderMilkdown } from '../editor/event-listeners';
	import { emojiPlugin } from './emoji-plugin';
	import UserAvatar from './user-avatar.svelte';
	import { genLoginLink } from '$lib/utils/ui';
	import { commonmarkStripped } from '$lib/milkdown/commonmark';
	import CommentMilkdown from './comment-milkdown.svelte';

	export let chapterId: string;

	$: avatar = $authStore?.model?.avatar;
	$: loggedIn = $authStore?.isValid;

	const queryClient = useQueryClient();

	let editor: CommentMilkdown | null = null;

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
				editor?.reset();
				toast.success('Comment posted');
				queryClient.setQueryData(
					['comments', { chapter: chapterId }],
					(oldData: ChapterCommentsResponse[] | undefined) => {
						if (!oldData) return [];
						if (!data) return oldData;
						return [data, ...oldData];
					}
				);
				queryClient.invalidateQueries(['comments', { chapter: chapterId }]);
				queryClient.invalidateQueries(['users', { chapter: chapterId }]);
			},
			onError(error, variables, context) {
				toast.error('Failed to post comment');
			}
		}
	);

	const onPost = () => {
		const milkdownEditor = editor?.getEditor();
		if (!milkdownEditor) return;
		$commentMutation.mutate(renderMilkdown(milkdownEditor));
	};
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={avatar} />
	{#if loggedIn}
		<div>
			<CommentMilkdown
				class="p-4 border border-solid rounded-md relative mb-4"
				bind:this={editor}
			/>
			<Button on:click={onPost}>Post comment</Button>
		</div>
	{:else}
		<div class="h-full flex items-center">
			<span>
				<a href={genLoginLink()} class="anchor">Log in</a> to start commenting
			</span>
		</div>
	{/if}
</div>
