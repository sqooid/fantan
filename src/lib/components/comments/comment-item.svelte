<script lang="ts">
	import type {
		ChapterCommentReactionsResponse,
		ChapterCommentsResponse
	} from '$lib/pocketbase-types';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ReactionAdd from './reaction-add.svelte';
	import ReactionBadge from './reaction-badge.svelte';
	import UserAvatar from './user-avatar.svelte';
	import UserHoverCard from './user-hover-card.svelte';
	import moment from 'moment';
	import { commentMd } from './comment-render';
	import CommentMenu from './comment-menu.svelte';
	import CommentMilkdown from './comment-milkdown.svelte';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { slide } from 'svelte/transition';
	import { renderMilkdown } from '../editor/event-listeners';
	import { toast } from 'svelte-sonner';

	const likeEmoji = '👍';
	const dislikeEmoji = '👎';

	export let comment: ChapterCommentsResponse;
	export let userInfo: CUserType | undefined;
	export let ownReactions: ChapterCommentReactionsResponse[] = [];

	const queryClient = useQueryClient();

	$: commentId = comment.id;
	$: reactions = (comment.reactions ?? {}) as Record<string, number>;

	$: timeString = comment.contentUpdated
		? `${moment(comment.contentUpdated).fromNow(true)} (edited)`
		: moment(comment.created).fromNow(true);

	$: loggedIn = pb.authStore?.isValid;
	$: activeReactions = ownReactions.reduce(
		(acc, reaction) => {
			if (reaction.comment === commentId) {
				acc[reaction.reaction] = true;
			}
			return acc;
		},
		{} as Record<string, boolean>
	);

	$: likes = reactions[likeEmoji] || 0;
	$: dislikes = reactions[dislikeEmoji] || 0;
	$: filteredReactions = Object.entries(reactions).filter(
		([reaction, count]) => reaction !== likeEmoji && reaction !== dislikeEmoji && count > 0
	);
	$: userId = $authStore?.model?.id;

	const reactionMutation = useMutation(
		async (reaction: string) => {
			const { count } = await pb.send('/c/toggle-reaction', {
				method: 'POST',
				body: {
					reaction: reaction,
					comment: commentId
				}
			});
			return { reaction, count };
		},
		{
			onSuccess(data, variables, context) {
				reactions[data.reaction] = data.count;
				if (activeReactions[data.reaction]) {
					activeReactions[data.reaction] = false;
				} else {
					activeReactions[data.reaction] = true;
				}
				queryClient.invalidateQueries(['reactions', { user: userId }]);
			}
		}
	);

	const editSaveMutation = useMutation(
		async () => {
			const milkdownEditor = editor?.getEditor();
			if (!milkdownEditor) throw new Error('No editor');
			const content = renderMilkdown(milkdownEditor);
			const result = await pb
				.collection('chapterComments')
				.update(commentId, { content, user: userId });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				comment.content = data.content;
				comment.contentUpdated = data.contentUpdated;
				isEditing = false;
				toast.success('Comment saved');
				queryClient.invalidateQueries(['comments', { chapter: comment.chapter }]);
			},
			onError(error, variables, context) {
				toast.error('Failed to save comment');
			}
		}
	);

	const onChoose = (e: CustomEvent<string>) => {
		const emoji = e.detail;
		$reactionMutation.mutate(emoji);
	};

	let editor: CommentMilkdown | null = null;
	let isEditing = false;
	const onEdit = () => {
		isEditing = true;
	};
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={userInfo?.avatar} />
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-4">
			<UserHoverCard {userInfo} />
			<span class="muted">{timeString}</span>
			{#if loggedIn}
				<CommentMenu {comment} on:edit={onEdit} />
			{/if}
		</div>
		{#if !isEditing && !comment.deleted}
			<div class="milkdown comment">
				{@html commentMd.render(comment.content)}
			</div>
		{:else if isEditing}
			<CommentMilkdown
				class="p-4 border border-solid rounded-md relative mb-4"
				bind:this={editor}
				initialContent={comment.content}
			/>
			<div class="flex gap-4" transition:slide={{ duration: 150 }}>
				<Button variant="outline" on:click={() => (isEditing = false)}>Cancel</Button>
				<Button on:click={() => $editSaveMutation.mutate()}>Save</Button>
			</div>
		{:else}
			<span class="opacity-30">Comment deleted</span>
		{/if}
		<div class="flex gap-1 mt-3">
			<ReactionBadge
				emoji={likeEmoji}
				count={likes}
				on:click={() => $reactionMutation.mutate(likeEmoji)}
				active={activeReactions[likeEmoji]}
			/>
			<ReactionBadge
				emoji={dislikeEmoji}
				count={dislikes}
				on:click={() => $reactionMutation.mutate(dislikeEmoji)}
				active={activeReactions[dislikeEmoji]}
			/>
			{#each filteredReactions as [reaction, count] (reaction)}
				<ReactionBadge
					emoji={reaction}
					{count}
					active={activeReactions[reaction]}
					on:click={() => $reactionMutation.mutate(reaction)}
				/>
			{/each}
			{#if loggedIn}
				<ReactionAdd on:choose={onChoose} />
			{/if}
		</div>
	</div>
</div>
