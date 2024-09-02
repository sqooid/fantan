<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';

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
		required
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
		required
		id="password"
		label="Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
	/>
	<ValidatedField
		required
		id="passwordConfirm"
		label="Confirm Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
	/>
	<button type="button" class="btn variant-outline" on:click={onClick}>Sign up</button>
</dev>
