<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { blur } from 'svelte/transition';
	import ImageInput from '../inputs/image-input.svelte';
	import ValidatedField from '../inputs/validated-field.svelte';
	import { useMutation, useQuery } from '@sveltestack/svelte-query';
	import { pick } from 'lodash-es';
	import { toast } from 'svelte-sonner';
	import type { UsersRecord, UsersResponse } from '$lib/pocketbase-types';
	import { parsePbError } from '../inputs/validation';

	$: info = ($authStore?.model ?? {}) as UsersResponse;
	let errors: Record<string, string> | null = null;

	let tainted = false;
	const onInput = () => {
		tainted = true;
	};

	$: avatarUrl = pb.files.getUrl($authStore?.model ?? {}, $authStore?.model?.avatar);

	const userMutate = useMutation(
		async () => {
			const result = await pb
				.collection('users')
				.update(info.id, pick(info, ['name', 'discordWebhook']));
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
				errors = parsePbError(error);
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
		errors = null;
		$userMutate.mutate();
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-4 sm:grid grid-cols-2">
		<ImageInput src={avatarUrl} class="w-full h-fit" on:input={onUpdateAvatar} />
		<div class="flex flex-col gap-4">
			<ValidatedField
				required
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
				placeholder="Name"
			/>
			<ValidatedField
				infoObject={info}
				errorObject={errors}
				on:input={onInput}
				type="text"
				id="email"
				label="Email"
			/>
			<ValidatedField
				infoObject={info}
				errorObject={errors}
				on:input={onInput}
				type="text"
				id="discordWebhook"
				label="Discord notification webhook"
				placeholder="https://discord.com/api/webhooks/..."
				tooltip
			>
				<span slot="tooltip-content" class="max-w-8 text-wrap">
					Provide a <a
						href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
						class="anchor">Discord webhook</a
					>
					to receive notifications on new chapters to favourited novels
				</span>
			</ValidatedField>
			{#if tainted}
				<div transition:blur={{ duration: 150 }}>
					<Button on:click={saveChanges}>Save changes</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
