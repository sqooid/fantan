<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Dialog from '$lib/shadcn/components/ui/dialog';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { pb } from '$lib/stores/pocketbase';
	import { toast } from 'svelte-sonner';

	export let id: string;
	export let novelId: string;

	let dialogOpen = false;
	const queryClient = useQueryClient();

	const deleteMutation = useMutation(
		async () => {
			const result = await pb.collection('chapters').delete(id);
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Deleted chapter');
				queryClient.invalidateQueries(['chapters', novelId]);
			},
			onError(error, variables, context) {
				toast.error('Failed to delete chapter');
			},
			onSettled(data, error, variables, context) {
				dialogOpen = false;
			}
		}
	);

	const onClickDelete = () => {
		dialogOpen = true;
	};

	const onDelete = () => {
		$deleteMutation.mutate();
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			size="icon"
			class="relative h-8 w-8 p-0"
			title="Actions"
		>
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item on:click={onClickDelete} class="cursor-pointer">Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger />
	<Dialog.Content>
		<Dialog.Title>Delete chapter</Dialog.Title>
		<Dialog.Description>
			Are you sure you want to delete this chapter? This action cannot be undone.
		</Dialog.Description>
		<Dialog.Close />
		<Dialog.Footer>
			<Button on:click={() => (dialogOpen = false)}>Cancel</Button>
			<Button variant="destructive" on:click={onDelete}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
