<script lang="ts">
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ReactionBadge from './reaction-badge.svelte';
	import UserAvatar from './user-avatar.svelte';
	import UserHoverCard from './user-hover-card.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';

	const likeEmoji = 'thumbsup';
	const dislikeEmoji = 'thumbsdown';

	export let commentId: string;
	export let userInfo: CUserType | undefined;
	export let reactions: Record<string, number> = {};
	$: likes = reactions[likeEmoji] || 0;
	$: dislikes = reactions[dislikeEmoji] || 0;
	$: filteredReactions = Object.entries(reactions).filter(
		([reaction, count]) => reaction !== likeEmoji && reaction !== dislikeEmoji && count > 0
	);
	$: id = $authStore?.model?.id;

	const queryClient = useQueryClient();

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
			}
		}
	);

	const onReaction = (reaction: string) => {};
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
				reaction={likeEmoji}
				count={likes}
				on:click={() => $reactionMutation.mutate(likeEmoji)}
			/>
			<ReactionBadge
				reaction={dislikeEmoji}
				count={dislikes}
				on:click={() => $reactionMutation.mutate(dislikeEmoji)}
			/>
			{#each filteredReactions as [reaction, count]}
				<ReactionBadge {reaction} {count} />
			{/each}
		</div>
	</div>
</div>
