<script lang="ts">
	import { page } from '$app/stores';
	import ChapterListDatatable from '$lib/components/chapter-list-datatable.svelte';
	import ImageInput from '$lib/components/inputs/image-input.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import { parsePbError } from '$lib/components/inputs/validation';
	import { NovelsSourceLanguageOptions } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb } from '$lib/stores/pocketbase';
	import { slideBlur } from '$lib/utils/transition';
	import { useMutation, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { assign, debounce } from 'lodash-es';
	import { toast } from 'svelte-sonner';
	import { blur } from 'svelte/transition';

	const novelId = $page.params.slug;
	const queryClient = useQueryClient();

	const novelQuery = useQuery(
		['novel', novelId],
		async () => {
			const result = await pb.collection('novels').getOne(novelId, {});
			return result;
		},
		{
			onSuccess(data) {
				assign(info, data);
			}
		}
	);

	let savingDetails = false;
	const novelDetailsMutation = useMutation(
		async () => {
			const result = await pb.collection('novels').update(novelId, info);
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Saved changes');
				queryClient.invalidateQueries(['novel', novelId]);
				tainted = false;
			},
			onError(error, variables, context) {
				errors = parsePbError(error);
				toast.error('Failed to save changes');
			},
			onSettled(data, error, variables, context) {
				savingDetails = false;
			}
		}
	);

	const info = {
		title: '',
		description: '',
		cover: '',
		originalAuthor: '',
		originalSource: '',
		sourceLanguage: 'Other'
	};
	let errors: Record<string, string> | null = null;

	let tainted = false;
	const onInput = () => {
		tainted = true;
	};

	const coverChangeMutation = useMutation(
		async (file: File) => {
			const result = await pb.collection('novels').update(novelId, { cover: file });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['novel', novelId]);
				toast.success('Updated cover image');
			},
			onError(error, variables, context) {
				const e = parsePbError(error);
				toast.error(e?.cover ?? 'Failed to update cover image');
			}
		}
	);
	const saveChanges = debounce(() => {
		errors = null;
		savingDetails = true;
		$novelDetailsMutation.mutate();
	}, 150);

	const onChooseCover = (e: CustomEvent<File>) => {
		const file = e.detail;
		$coverChangeMutation.mutate(file);
	};

	const languageOptions = Object.keys(NovelsSourceLanguageOptions).map((key) => ({
		value: key,
		label: key
	}));
</script>

{#if $novelQuery.isSuccess}
	<div class="flex flex-col gap-16 max-w-4xl mx-auto">
		<div class="flex gap-8">
			<ImageInput
				on:input={onChooseCover}
				class="w-80"
				src={pb.files.getUrl($novelQuery.data, $novelQuery.data.cover)}
				alt={`${$novelQuery.data.title} cover image`}
			/>
			<div class="flex w-full flex-col gap-4">
				<ValidatedField
					required
					type="text"
					id="title"
					label="Title"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				<ValidatedField
					type="textarea"
					id="description"
					label="Description"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				<ValidatedField
					required
					type="text"
					id="originalAuthor"
					label="Original author"
					placeholder="Author name"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				<ValidatedField
					type="text"
					id="originalSource"
					label="Original source url"
					placeholder="https://example.com"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				<ValidatedField
					type="select"
					id="sourceLanguage"
					label="Source language"
					placeholder="Select language"
					selectOptions={languageOptions}
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
				/>
				{#if tainted}
					<div in:slideBlur={{ duration: 150 }} out:blur={{ duration: 150 }} class="w-fit">
						<Button class="self-start" on:click={saveChanges}>
							<div class="flex items-center">
								<!-- {#if savingDetails}
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
							{/if} -->
								Save changes
							</div>
						</Button>
					</div>
				{/if}
			</div>
		</div>
		<ChapterListDatatable edit {novelId} />
	</div>
{/if}
