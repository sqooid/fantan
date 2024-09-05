<script lang="ts">
	import { page } from '$app/stores';
	import ChapterListDatatable from '$lib/components/chapter-list-datatable.svelte';
	import ChapterList from '$lib/components/chapter-list.svelte';
	import ImageInput from '$lib/components/inputs/image-input.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import { parsePbError } from '$lib/components/inputs/validation';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb } from '$lib/stores/pocketbase';
	import { animateChildChanges, animateLayoutChanges } from '$lib/utils/ui';
	import { useMutation, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { debounce } from 'lodash-es';
	import { LoaderCircle } from 'lucide-svelte';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import { blur, scale } from 'svelte/transition';

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
		cover: ''
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
				{#if tainted}
					<div transition:blur={{ duration: 150 }} class="w-fit">
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
