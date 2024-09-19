<script lang="ts">
	import { useMutation } from '@sveltestack/svelte-query';
	import ReactionBadge from './reaction-badge.svelte';
	import UserAvatar from './user-avatar.svelte';
	import UserHoverCard from './user-hover-card.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';

	export let commentId: string;
	export let userInfo: CUserType | undefined;
	export let reactions: Record<string, number> = {};

	$: id = $authStore?.model?.id;
	const reactionMutation = useMutation(async (params: { reaction: string; add: boolean }) => {
		if (params.add) {
			const result = await pb.collection('chapterCommentReactions').create({
				chapter: commentId,
				user: id,
				reaction: params.reaction
			});
			return result;
		} else {
			const existing = await pb.collection('chapterCommentReactions').getFirstListItem(
				pb.filter('comment = {:commentId} && user = {:userId} AND reaction = {:reaction}', {
					commentId,
					userId: id,
					reaction: params.reaction
				}),
				{ fields: 'id' }
			);
			if (!existing.id) return null;
			const result = await pb.collection('chapterCommentReactions').delete(existing.id);
			return result;
		}
	});
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
		<div class="flex">
			{#each Object.entries(reactions) as [reaction, count]}
				<ReactionBadge {reaction} {count} />
			{/each}
		</div>
	</div>
</div>
