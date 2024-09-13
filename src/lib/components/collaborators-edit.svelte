<script lang="ts">
	import { badgeVariants } from '$lib/shadcn/components/ui/badge';
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Dialog from '$lib/shadcn/components/ui/dialog';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import ValidatedField from './inputs/validated-field.svelte';

	export let novelId: string;
	export let isOwner: boolean;

	const queryClient = useQueryClient();

	const editorsQuery = useQuery<{ id: string; name: string; username: string }[]>({
		enabled: false
	});
	$: if (novelId) {
		editorsQuery.setOptions({
			queryKey: ['novel', 'editors', novelId],
			queryFn: async () => {
				const result = await pb.collection('novels').getOne(novelId, { fields: 'editors' });
				if (result.editors.length === 0) return [];
				const editors = await fetch(pb.buildUrl(`/c/user?id=${result.editors.join(',')}`));
				const data = await editors.json();
				return data;
			},
			enabled: true
		});
	}

	const editorMutate = useMutation(
		async () => {
			const result = await pb.collection('novels').update(novelId, { 'editors+': addInfo.id });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['novel', 'editors', novelId]);
				addInfo.id = '';
				open = false;
			},
			onError(error, variables, context) {
				addErrors = { id: 'User not found' };
			}
		}
	);

	let addInfo = { id: '' };
	let addErrors: Record<string, string> | null = null;

	let open = false;
	$: editors = $editorsQuery.data?.map((e) => ({ id: e.id, name: e.name || e.username })) ?? [];

	const onAdd = async () => {
		addErrors = null;
		$editorMutate.mutate();
	};

	let openRemove = false;
	let removeInfo = { id: '', name: '' };
	const removeMutate = useMutation(
		async (id: string) => {
			const result = await pb.collection('novels').update(novelId, { 'editors-': id });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['novel', 'editors', novelId]);
				openRemove = false;
			},
			onError(error, variables, context) {
				toast.error('Failed to remove collaborator');
			}
		}
	);
	const promptRemove = (id: string, name: string) => {
		removeInfo.id = id;
		removeInfo.name = name;
		openRemove = true;
	};

	const onRemove = async () => {
		openRemove = false;
		$removeMutate.mutate(removeInfo.id);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-8 items-center">
		<h2 class="h2">Collaborators</h2>
		{#if isOwner}
			<Dialog.Root bind:open>
				<Dialog.Trigger asChild let:builder>
					<Button variant="outline" builders={[builder]}>Add collaborator</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add collaborator</Dialog.Title>
						<Dialog.Description>
							This user will be able to create and edit chapters for this novel.
						</Dialog.Description>
					</Dialog.Header>
					<ValidatedField
						label="User ID"
						id="id"
						type="text"
						placeholder="User ID"
						infoObject={addInfo}
						errorObject={addErrors}
						required
					/>
					<Button on:click={onAdd}>Add</Button>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
	<div>
		{#each editors as editor}
			<button
				disabled={!isOwner}
				on:click={() => promptRemove(editor.id, editor.name)}
				class={badgeVariants({ variant: 'outline' })}>{editor.name}</button
			>
		{:else}
			<span>No collaborators</span>
		{/each}
	</div>
</div>

<Dialog.Root bind:open={openRemove}>
	<Dialog.Trigger></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Remove collaborator</Dialog.Title>
			<Dialog.Description
				>Are you sure you want to remove {removeInfo.name} as an editor?</Dialog.Description
			>
		</Dialog.Header>
		<div class="flex gap-4">
			<Button on:click={() => (openRemove = false)} variant="outline">Cancel</Button>
			<Button on:click={onRemove} variant="destructive">Remove</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
