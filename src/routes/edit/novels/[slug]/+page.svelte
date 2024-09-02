<script lang="ts">
	import { page } from '$app/stores';
	import ChapterList from '$lib/components/chapter-list.svelte';
	import RichButton from '$lib/components/inputs/rich-button.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';
	import { ClientResponseError } from 'pocketbase';

	const novelId = $page.params.slug;

	const toast = getToastStore();

	const novelQuery = useQuery(
		['novel', novelId],
		async () => {
			const result = await pb.collection('novels').getOne(novelId, {});
			return result;
		},
		{
			onSuccess(data) {
				info.title = data.title;
				info.description = data.description;
			}
		}
	);

	let savingDetails = false;
	const novelDetailsMutation = useMutation(
		async () => {
			const result = await pb
				.collection('novels')
				.update(novelId, { title: info.title, description: info.description });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.trigger({ message: 'Saved changes', background: 'variant-filled-success' });
			},
			onError(error, variables, context) {
				let message = 'Failed to save changes';
				if (error instanceof ClientResponseError) {
					message += `: ${error}`;
				}
				toast.trigger({ message, background: 'variant-error-success' });
			},
			onSettled(data, error, variables, context) {
				savingDetails = false;
			}
		}
	);

	const info = {
		title: '',
		description: '',
		cover: ''
	};
	let errors: Record<string, string> | null = null;

	let tainted = false;
	const onInput = () => {
		tainted = true;
	};

	const saveChanges = () => {
		savingDetails = true;
		$novelDetailsMutation.mutate();
	};
</script>

{#if $novelQuery.isSuccess}
	<div class="flex flex-col">
		<div class="flex gap-8">
			<img
				class="h-64"
				src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
				alt={`${$novelQuery.data.title} cover image`}
			/>
			<div class="flex w-full flex-col gap-4">
				<ValidatedField
					type="text"
					id="title"
					label="Title"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				<ValidatedField
					type="text"
					id="description"
					label="Description"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				{#if tainted}
					<RichButton
						class="self-start variant-filled"
						on:click={saveChanges}
						loading={savingDetails}>Save changes</RichButton
					>
				{/if}
			</div>
		</div>
	</div>
	<ChapterList edit {novelId} />
{/if}
