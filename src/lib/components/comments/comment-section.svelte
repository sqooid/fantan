<script lang="ts">
	import type {
		ChapterCommentReactionsResponse,
		ChapterCommentsResponse
	} from '$lib/pocketbase-types';
	import { pb } from '$lib/stores/pocketbase';
	import { useQuery } from '@sveltestack/svelte-query';
	import CommentItem from './comment-item.svelte';
	import CommentWrite from './comment-write.svelte';
	import UserAvatar from './user-avatar.svelte';

	export let chapterId: string;

	$: userId = pb.authStore?.model?.id;

	let showComments = true;

	const commentsQuery = useQuery<
		(ChapterCommentsResponse & { reactions: Record<string, number> })[]
	>({ enabled: false });
	$: if (chapterId && showComments) {
		commentsQuery.setOptions({
			queryKey: ['comments', { chapter: chapterId }],
			queryFn: async () => {
				const result = await pb.collection('chapterComments').getFullList({
					filter: pb.filter('chapter = {:chapterId} && (deleted != true || user = {:userId})', {
						chapterId,
						userId
					}),
					sort: '-created'
				});
				return result as any;
			},
			enabled: true
		});
	} else {
		commentsQuery.setEnabled(false);
	}

	const usersQuery = useQuery<Record<string, CUserType>>({ enabled: false });
	$: if ($commentsQuery.data) {
		usersQuery.setOptions({
			queryKey: ['users', { chapter: chapterId }],
			queryFn: async () => {
				const userIds = $commentsQuery.data.map((comment) => comment.user);
				const users: CUserType[] = await pb.send('/c/users', { query: { ids: userIds } });
				return users.reduce(
					(acc, user) => {
						if (acc[user.id]) return acc;
						user.avatar = pb.buildUrl(`/api/files/users/${user.id}/${user.avatar}`);
						acc[user.id] = user;
						return acc;
					},
					{} as Record<string, CUserType>
				);
			},
			enabled: true
		});
	}

	const ownReactions = useQuery<ChapterCommentReactionsResponse[]>({
		enabled: false
	});
	$: if (userId) {
		ownReactions.setOptions({
			queryKey: ['reactions', { user: userId }],
			queryFn: async () => {
				const reactions = await pb.collection('chapterCommentReactions').getFullList({
					filter: pb.filter('user = {:userId} && comment.chapter.id = {:chapterId}', {
						userId,
						chapterId
					}),
					fields: 'reaction,comment'
				});

				return reactions;
			},
			enabled: true
		});
	}
</script>

<div class="flex flex-col gap-4 max-w-prose mx-auto w-full mb-12">
	<h3 class="h3">Comments</h3>
	<CommentWrite {chapterId} />
	<div class="flex flex-col gap-8">
		{#each $commentsQuery.data ?? [] as comment}
			<CommentItem
				{comment}
				userInfo={$usersQuery.data?.[comment.user]}
				ownReactions={$ownReactions.data}
			></CommentItem>
		{:else}
			<div class="grid grid-cols-[auto_1fr] gap-x-4 mt-4">
				<UserAvatar class="invisible" />
				<span class="large">Be the first to write a comment!</span>
			</div>
		{/each}
	</div>
</div>
