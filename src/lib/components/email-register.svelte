<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { ClientResponseError } from 'pocketbase';
	import ValidatedField from './inputs/validated-field.svelte';
	import { goto } from '$app/navigation';
	import { clearErrors, parsePbError } from './inputs/validation';

	const toast = getToastStore();

	const info = {
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	};
	let errors: Record<string, string> | null = null;

	const onClick = async () => {
		try {
			await pb.collection('users').create(info);
			await pb.collection('users').authWithPassword(info.username, info.password);
			goto('/');
		} catch (error) {
			errors = parsePbError(error);
		}
	};
</script>

<dev class="flex flex-col gap-2">
	<span class="h4">Create a new account</span>
	<ValidatedField
		id="username"
		label="Username"
		placeholder="john"
		type="text"
		infoObject={info}
		errorObject={errors}
	/>
	<ValidatedField
		id="email"
		label="Email"
		placeholder="john@example.com"
		type="email"
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
	<ValidatedField
		id="passwordConfirm"
		label="Confirm Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
	/>
	<button type="button" class="btn variant-outline" on:click={onClick}>Sign up</button>
</dev>
