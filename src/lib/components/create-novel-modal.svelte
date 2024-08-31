<script lang="ts">
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import ValidatedField from './inputs/validated-field.svelte';
	import RichButton from './inputs/rich-button.svelte';
	import { parsePbError } from './inputs/validation';
	import { goto } from '$app/navigation';

	const modal = getModalStore();
	const toast = getToastStore();
	const info = {
		title: '',
		description: '',
		cover: ''
	};
	let errors: Record<string, string> | null = null;

	let coverInput: ValidatedField;

	const onCreate = async () => {
		const form = new FormData();
		const file = coverInput.getFiles()?.[0];
		form.append('cover', file);
		form.append('title', info.title);
		form.append('description', info.description);
		form.append('owner', $authStore?.model?.id);
		try {
			const result = await pb.collection('novels').create(form);
			modal.close();
			goto(`/edit/novels/${result.id}`);
		} catch (error) {
			errors = parsePbError(error);
			if (!errors) {
				toast.trigger({ message: 'Failed to create novel.', background: 'variant-filled-error' });
			}
		}
	};
</script>

<div class="w-modal flex flex-col gap-4 card p-8">
	<ValidatedField type="text" id="title" label="Title" infoObject={info} errorObject={errors} />
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
	<RichButton class="variant-filled" on:click={onCreate}>Create</RichButton>
</div>
