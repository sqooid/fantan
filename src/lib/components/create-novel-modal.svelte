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
	import { NovelsSourceLanguageOptions } from '$lib/pocketbase-types';

	const info = {
		title: '',
		slug: '',
		description: '',
		cover: '',
		originalAuthor: '',
		originalSource: '',
		sourceLanguage: 'Other'
	};
	let errors: Record<string, string> | null = null;

	const queryClient = useQueryClient();
	const mutateNovels = useMutation(
		async () => {
			const form = new FormData();
			const file = coverInput.getFiles()?.[0];
			if (file) {
				form.append('cover', file);
			}
			form.append('title', info.title);
			form.append('slug', info.slug);
			form.append('description', info.description);
			form.append('owner', $authStore?.model?.id);
			form.append('originalAuthor', info.originalAuthor);
			form.append('originalSource', info.originalSource);
			form.append('sourceLanguage', info.sourceLanguage);
			return await pb.collection('novels').create(form);
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(['novels', 'edit']);
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

	const languageOptions = Object.keys(NovelsSourceLanguageOptions).map((key) => ({
		value: key,
		label: key
	}));
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
				required
				type="text"
				id="slug"
				label="Slug"
				placeholder="e.g. my-novel"
				infoObject={info}
				errorObject={errors}
				tooltip
			>
				<span slot="tooltip-content"
					>This determines the url of the novel - e.g. /my-novel/volume-1/chapter-1. Can contain
					[a-z0-9] and -</span
				>
			</ValidatedField>
			<ValidatedField
				type="textarea"
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
			<ValidatedField
				required
				type="text"
				id="originalAuthor"
				label="Original author"
				placeholder="Author name"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField
				type="text"
				id="originalSource"
				label="Original source url"
				placeholder="https://example.com"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField
				type="select"
				id="sourceLanguage"
				label="Source language"
				placeholder="Select language"
				selectOptions={languageOptions}
				infoObject={info}
				errorObject={errors}
			/>
			<Dialog.Footer>
				<Button on:click={() => $mutateNovels.mutate()} autoEnter>Create</Button>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
