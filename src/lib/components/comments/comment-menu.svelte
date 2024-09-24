<script lang="ts">
	import type { ChapterCommentsResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation } from '@sveltestack/svelte-query';
	import { EllipsisVertical, Pencil, Trash, Flag } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let comment: ChapterCommentsResponse;

	const dispatch = createEventDispatcher<{ edit: null }>();

	$: userId = pb.authStore?.model?.id;
	$: isOwner = comment.user === userId;
	$: loggedIn = pb.authStore?.isValid;

	const onEdit = () => {
		dispatch('edit');
	};

	const deleteMutation = useMutation(
		async () => {
			await pb.collection('chapterComments').update(comment.id, { deleted: true });
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Comment deleted');
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
			<DropdownMenu.Item
				class="cursor-pointer text-destructive"
				on:click={() => $deleteMutation.mutate()}
			>
				<Trash class="icon-comment-menu" />
				<span> Delete </span>
			</DropdownMenu.Item>
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
