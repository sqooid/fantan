<script lang="ts">
	import { useQuery } from '@sveltestack/svelte-query';
	import CommentWrite from './comment-write.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import type { ChapterCommentsResponse } from '$lib/pocketbase-types';
	import MarkdownIt from 'markdown-it';
	import { full as emoji } from 'markdown-it-emoji';
	import CommentItem from './comment-item.svelte';

	export let chapterId: string;

	let showComments = true;
	let md = new MarkdownIt({ linkify: true }).use(emoji);

	const commentsQuery = useQuery<ChapterCommentsResponse[]>({ enabled: false });
	$: if (chapterId && showComments) {
		commentsQuery.setOptions({
			queryKey: ['comments', { chapter: chapterId }],
			queryFn: async () => {
				const result = await pb
					.collection('chapterComments')
					.getFullList({ filter: pb.filter('chapter = {:chapterId}', { chapterId }) });
				return result;
			},
			enabled: true
		});
	} else {
		commentsQuery.setEnabled(false);
	}
	const usersQuery = useQuery<CUserType[]>({ enabled: false });
	$: if ($commentsQuery.data) {
		usersQuery.setOptions({
			queryKey: ['users', { chapter: chapterId }],
			queryFn: async () => {
				const userIds = $commentsQuery.data.map((comment) => comment.user);
				const users = await pb.send('/c/users', { query: { ids: userIds } });
				return users;
			},
			enabled: true
		});
	} else {
		usersQuery.setEnabled(false);
	}
	$: userMap =
		$usersQuery.data?.reduce(
			(acc, user) => {
				user.avatar = pb.buildUrl(`/api/files/users/${user.id}/${user.avatar}`);
				acc[user.id] = user;
				return acc;
			},
			{} as Record<string, CUserType>
		) ?? {};
</script>

<div class="flex flex-col gap-4 max-w-prose mx-auto w-full">
	<h3 class="h3">Comments</h3>
	<CommentWrite {chapterId} />
	<div class="flex flex-col gap-8">
		{#each $commentsQuery.data ?? [] as comment}
			<CommentItem userInfo={userMap[comment.user]}>
				{@html md.render(comment.content)}
			</CommentItem>
		{:else}
			fasfasdf
		{/each}
	</div>
</div>
