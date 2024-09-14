<script lang="ts">
	import { page } from '$app/stores';
	import ChapterListDatatable from '$lib/components/chapter-list-datatable.svelte';
	import CollaboratorsEdit from '$lib/components/collaborators-edit.svelte';
	import ImageInput from '$lib/components/inputs/image-input.svelte';
	import ValidatedField from '$lib/components/inputs/validated-field.svelte';
	import { parsePbError } from '$lib/components/inputs/validation';
	import { NovelsSourceLanguageOptions, type NovelsResponse } from '$lib/pocketbase-types';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { breadcrumbStore } from '$lib/stores/navigation';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { slideBlur } from '$lib/utils/transition';
	import { useMutation, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { assign, debounce } from 'lodash-es';
	import { toast } from 'svelte-sonner';
	import { blur } from 'svelte/transition';

	$: novelId = $page.params.slug;
	const queryClient = useQueryClient();

	$: if ($novelQuery.data)
		$breadcrumbStore = [
			{ title: 'Home', href: '/' },
			{ title: 'Create', href: '/create' },
			{ title: $novelQuery.data.title, href: `/novels/${novelId}` }
		];

	const novelQuery = useQuery<NovelsResponse>({
		enabled: false
	});
	$: if (novelId) {
		novelQuery.setOptions({
			queryKey: ['novel', novelId],
			queryFn: async () => {
				const result = await pb.collection('novels').getOne(novelId);
				return result;
			},
			enabled: !tainted
		});
	}

	$: isOwner = $novelQuery.data?.owner === $authStore?.model?.id;

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

	$: info = $novelQuery.data ?? {
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
	$: novelQuery.setEnabled(!tainted);

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
					disabled={!isOwner}
				/>
				<ValidatedField
					type="textarea"
					id="description"
					label="Description"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
					disabled={!isOwner}
					tooltip
				>
					<span slot="tooltip-content"
						>Raw <a href="https://www.markdownguide.org/basic-syntax/" class="anchor"
							>markdown syntax</a
						> will be rendered for viewers</span
					>
				</ValidatedField>
				<ValidatedField
					required
					type="text"
					id="originalAuthor"
					label="Original author"
					placeholder="Author name"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
					disabled={!isOwner}
				/>
				<ValidatedField
					type="text"
					id="originalSource"
					label="Original source url"
					placeholder="https://example.com"
					infoObject={info}
					errorObject={errors}
					on:input={onInput}
					disabled={!isOwner}
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
					disabled={!isOwner}
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
		<CollaboratorsEdit {novelId} {isOwner} />
		<ChapterListDatatable edit {novelId} />
	</div>
{/if}
