<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { ClientResponseError } from 'pocketbase';
	import ValidatedField from './inputs/validated-field.svelte';
	import { clearErrors } from './inputs/validation';
	import { goto } from '$app/navigation';

	const toast = getToastStore();

	const info = {
		identity: '',
		password: ''
	};
	const errors: Record<string, string> = { ...info };

	const onClick = async () => {
		try {
			await pb.collection('users').authWithPassword(info.identity, info.password);
			goto('/');
		} catch (error) {
			if (error instanceof ClientResponseError) {
				clearErrors(errors);
				let hasKnownError = false;
				Object.keys(error.response.data).forEach((k) => {
					hasKnownError = true;
					errors[k] = error.response.data[k].message;
				});
				console.log(errors);

				if (!hasKnownError) {
					toast.trigger({
						message: error.message,
						background: 'variant-filled-error'
					});
				}
			}
		}
	};
</script>

<dev class="flex flex-col gap-2">
	<span class="h4">Log in with username/email and password</span>
	<ValidatedField
		id="identity"
		label="Username or password"
		placeholder="john"
		type="text"
		infoObject={info}
		errorObject={errors}
	/>
	<ValidatedField
		id="password"
		label="Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
	/>
	<button type="button" class="btn variant-outline" on:click={onClick}>Log in</button>
</dev>
