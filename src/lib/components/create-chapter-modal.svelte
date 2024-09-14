<script lang="ts">
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/shadcn/components/ui/button';
	import { Dialog, DialogTrigger } from '$lib/shadcn/components/ui/dialog';
	import DialogContent from '$lib/shadcn/components/ui/dialog/dialog-content.svelte';
	import DialogFooter from '$lib/shadcn/components/ui/dialog/dialog-footer.svelte';
	import DialogHeader from '$lib/shadcn/components/ui/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/shadcn/components/ui/dialog/dialog-title.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { toast } from 'svelte-sonner';
	import type { ChapterContent, ChapterSection } from './editor/content-types';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';

	export let novelId: string;

	let open = false;

	const content: ChapterSection = { source: '', translated: '' };
	const info: Record<string, any> = {
		novel: novelId,
		value: '',
		volume: 1,
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
				queryClient.invalidateQueries(['chapters', novelId]);
				open = false;
				goto(`/edit/chapters/${data.id}`);
			},
			onError(error, variables, context) {
				errors = parsePbError(error);
				if (!errors) {
					toast.error('Failed to create chapter');
				}
			}
		}
	);
</script>

<Dialog bind:open>
	<DialogTrigger class={buttonVariants({ variant: 'outline' })}>Create chapter</DialogTrigger>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Create new chapter</DialogTitle>
		</DialogHeader>
		<div class="flex flex-col gap-4">
			<ValidatedField
				required
				type="text"
				id="value"
				label="Number"
				placeholder="e.g. 7 or 7.1"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField
				required
				type="number"
				id="volume"
				label="Volume"
				placeholder="e.g. 1"
				infoObject={info}
				errorObject={errors}
			/>
			<ValidatedField type="text" id="title" label="Title" infoObject={info} errorObject={errors} />
		</div>
		<DialogFooter>
			<Button on:click={() => $mutateChapters.mutate()} autoEnter>Create</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
