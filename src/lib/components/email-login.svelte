<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';

	const info = {
		identity: '',
		password: ''
	};
	let errors: Record<string, string> | null = null;

	const onClick = async () => {
		try {
			await pb.collection('users').authWithPassword(info.identity, info.password);
			goto('/');
		} catch (error) {
			if (error instanceof ClientResponseError) {
				errors = parsePbError(error);
				if (!errors) {
					toast.error(error.message);
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
