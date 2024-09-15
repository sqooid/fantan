<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let id: string;
	export let novelId: string;
	export let published: boolean;

	const queryClient = useQueryClient();

	const toggleVisibilityMutation = useMutation(
		async () => {
			const result = await pb.collection('chapters').update(id, { published: !published });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Changed chapter visibility');
				queryClient.invalidateQueries(['chapters', { novel: novelId }]);
				queryClient.invalidateQueries(['chapter', { id }]);
				published = !published;
			},
			onError(error, variables, context) {
				toast.error('Failed to change chapter visiblity');
			}
		}
	);

	const onClick = () => {
		$toggleVisibilityMutation.mutate();
	};
</script>

<Button on:click={onClick} variant="ghost" title="Toggle visibility">
	{#if published}
		<Eye class="w-4 h-4" />
	{:else}
		<EyeOff class="w-4 h-4" />
	{/if}
</Button>
