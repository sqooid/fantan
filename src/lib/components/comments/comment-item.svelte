<script lang="ts">
	import type { ChapterCommentReactionsResponse } from '$lib/pocketbase-types';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ReactionAdd from './reaction-add.svelte';
	import ReactionBadge from './reaction-badge.svelte';
	import UserAvatar from './user-avatar.svelte';
	import UserHoverCard from './user-hover-card.svelte';

	const likeEmoji = '👍';
	const dislikeEmoji = '👎';

	export let commentId: string;
	export let userInfo: CUserType | undefined;
	export let reactions: Record<string, number> = {};
	export let ownReactions: ChapterCommentReactionsResponse[] = [];

	const queryClient = useQueryClient();

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

	const onChoose = (e: CustomEvent<string>) => {
		const emoji = e.detail;
		$reactionMutation.mutate(emoji);
	};
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={userInfo?.avatar} />
	<div class="flex flex-col gap-2">
		<div class="">
			<UserHoverCard {userInfo} />
		</div>
		<div class="milkdown">
			<slot />
		</div>
		<div class="flex gap-1">
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
