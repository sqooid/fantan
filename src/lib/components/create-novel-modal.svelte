<script lang="ts">
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/shadcn/components/ui/button';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import * as Dialog from '$lib/shadcn/components/ui/dialog';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';

	const info = {
		title: '',
		description: '',
		cover: ''
	};
	let errors: Record<string, string> | null = null;

	const queryClient = useQueryClient();
	const mutateNovels = useMutation(
		async () => {
			const form = new FormData();
			const file = coverInput.getFiles()?.[0];
			form.append('cover', file);
			form.append('title', info.title);
			form.append('description', info.description);
			form.append('owner', $authStore?.model?.id);
			return await pb.collection('novels').create(form);
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['novels']);
				goto(`/edit/novels/${data.id}`);
			},
			onError(error, variables, context) {
				errors = parsePbError(error);
				if (!errors) {
					toast.error('Failed to create novel.');
				}
			}
		}
	);

	let coverInput: ValidatedField;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Create novel</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create new novel</Dialog.Title>
		</Dialog.Header>
		<div class="w-modal flex flex-col gap-4 card p-8">
			<ValidatedField
				required
				type="text"
				id="title"
				label="Title"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField
				type="text"
				id="description"
				label="Description"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField
				bind:this={coverInput}
				type="file"
				id="cover"
				label="Cover image"
				infoObject={info}
				errorObject={errors}
				accept="image/*"
			/>
			<Dialog.Footer>
				<Button on:click={() => $mutateNovels.mutate()} autoEnter>Create</Button>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
