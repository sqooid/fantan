<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import RichButton from './inputs/rich-button.svelte';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';

	export let parent: any;

	const modal = getModalStore();
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
				modal.close();
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
	<RichButton class="variant-filled" on:click={() => $mutateNovels.mutate()}>Create</RichButton>
</div>
