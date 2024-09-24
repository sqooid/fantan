<script lang="ts">
	import type { ChapterCommentsResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { EllipsisVertical, Pencil, Trash, Flag, Undo } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let comment: ChapterCommentsResponse;

	const dispatch = createEventDispatcher<{ edit: null }>();

	$: userId = pb.authStore?.model?.id;
	$: isOwner = comment.user === userId;
	$: loggedIn = pb.authStore?.isValid;

	const queryClient = useQueryClient();

	const onEdit = () => {
		dispatch('edit');
	};

	const deleteMutation = useMutation(
		async (isDelete: boolean) => {
			return await pb
				.collection('chapterComments')
				.update(comment.id, { deleted: isDelete, user: userId });
		},
		{
			onSuccess(data, variables, context) {
				if (data.deleted) {
					toast.success('Comment deleted');
				} else {
					toast.success('Comment restored');
				}
				queryClient.invalidateQueries(['comments', { chapter: comment.chapter }]);
				comment.deleted = data.deleted;
			},
			onError(error, variables, context) {
				if (variables) {
					toast.error('Failed to delete comment');
				} else {
					toast.error('Failed to restore comment');
				}
			}
		}
	);

	const reportMutation = useMutation(
		async () => {
			await pb.collection('chapterCommentReports').create({ comment: comment.id, user: userId });
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Comment reported');
			},
			onError(error, variables, context) {
				// assume it's because the user already reported violating unique constraint
				toast.error('Already reported');
			}
		}
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon">
			<EllipsisVertical class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#if isOwner}
			<DropdownMenu.Item class="cursor-pointer" on:click={onEdit}>
				<Pencil class="icon-comment-menu" />
				<span>Edit</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			{#if !comment.deleted}
				<DropdownMenu.Item
					class="cursor-pointer text-destructive"
					on:click={() => $deleteMutation.mutate(true)}
				>
					<Trash class="icon-comment-menu" />
					<span>Delete</span>
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item class="cursor-pointer" on:click={() => $deleteMutation.mutate(false)}>
					<Undo class="icon-comment-menu" />
					<span>Restore</span>
				</DropdownMenu.Item>
			{/if}
		{:else if loggedIn}
			<DropdownMenu.Item
				class="cursor-pointer text-destructive"
				on:click={() => $reportMutation.mutate()}
			>
				<Flag class="icon-comment-menu" />
				<span> Report </span>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style lang="postcss">
	:global(.icon-comment-menu) {
		@apply mr-2 w-4 h-4;
	}
</style>
