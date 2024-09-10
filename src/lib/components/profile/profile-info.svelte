<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { blur } from 'svelte/transition';
	import ImageInput from '../inputs/image-input.svelte';
	import ValidatedField from '../inputs/validated-field.svelte';
	import { useMutation } from '@sveltestack/svelte-query';
	import { pick } from 'lodash-es';
	import { toast } from 'svelte-sonner';

	$: info = pick($authStore?.model ?? {}, ['id', 'name', 'username', 'email', 'avatar']);
	let errors: Record<string, string> | null = null;

	let tainted = false;
	const onInput = () => {
		tainted = true;
	};

	$: avatarUrl = pb.files.getUrl($authStore?.model ?? {}, $authStore?.model?.avatar);

	const userMutate = useMutation(
		async () => {
			const result = await pb.collection('users').update(info.id, pick(info, ['name']));
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Saved changes');
				pb.collection('users').authRefresh();
				tainted = false;
			},
			onError(error, variables, context) {
				toast.error('Failed to save changes');
			}
		}
	);

	const avatarMutate = useMutation(
		async (file: File) => {
			const result = await pb.collection('users').update(info.id as string, { avatar: file });
			return result;
		},
		{
			onSuccess(data, variables, context) {
				toast.success('Saved changes');
				pb.collection('users').authRefresh();
			},
			onError(error, variables, context) {
				toast.error('Failed to save changes');
			}
		}
	);

	const onUpdateAvatar = async (e: CustomEvent<File>) => {
		const file = e.detail;
		$avatarMutate.mutate(file);
	};

	const saveChanges = () => {
		$userMutate.mutate();
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-4 sm:grid grid-cols-2">
		<ImageInput src={avatarUrl} class="w-full h-fit" on:input={onUpdateAvatar} />
		<div class="flex flex-col gap-4">
			<ValidatedField
				infoObject={info}
				errorObject={errors}
				on:input={onInput}
				type="text"
				id="username"
				label="Username"
				disabled
			/>
			<ValidatedField
				infoObject={info}
				errorObject={errors}
				on:input={onInput}
				type="text"
				id="name"
				label="Display name"
			/>
			<ValidatedField
				infoObject={info}
				errorObject={errors}
				on:input={onInput}
				type="text"
				id="email"
				label="Email"
			/>
			{#if tainted}
				<div transition:blur={{ duration: 150 }}>
					<Button on:click={saveChanges}>Save changes</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
