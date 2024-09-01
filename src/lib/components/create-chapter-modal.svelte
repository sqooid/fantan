<script lang="ts">
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import ValidatedField from './inputs/validated-field.svelte';
	import RichButton from './inputs/rich-button.svelte';
	import { parsePbError } from './inputs/validation';
	import { goto } from '$app/navigation';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import type { ChapterContent } from './editor/content-types';

	export let parent: any;
	export let novelId: string;

	const modal = getModalStore();
	const toast = getToastStore();
	const content: ChapterContent = { sections: [] };
	const info: Record<string, any> = {
		novel: novelId,
		value: '',
		title: '',
		content
	};
	let errors: Record<string, string> | null = null;

	const queryClient = useQueryClient();
	const mutateChapters = useMutation(
		async () => {
			return await pb.collection('chapters').create(info);
		},
		{
			onSuccess(data, variables, context) {
				modal.close();
				queryClient.invalidateQueries(['chapters', novelId]);
				goto(`/edit/chapters/${data.id}`);
			},
			onError(error, variables, context) {
				errors = parsePbError(error);
				if (!errors) {
					toast.trigger({
						message: 'Failed to create chapter.',
						background: 'variant-filled-error'
					});
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
		id="value"
		label="Number"
		placeholder="e.g. 7 or 7.1"
		infoObject={info}
		errorObject={errors}
	/>
	<ValidatedField type="text" id="title" label="Title" infoObject={info} errorObject={errors} />
	<RichButton class="variant-filled" on:click={() => $mutateChapters.mutate()} enterClick
		>Create</RichButton
	>
</div>
