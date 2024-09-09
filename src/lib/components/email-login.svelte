<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import ValidatedField from './inputs/validated-field.svelte';
	import { parsePbError } from './inputs/validation';
	import { Button } from '$lib/shadcn/components/ui/button';

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

<div class="flex flex-col gap-2 w-full">
	<span class="large">Log in with username/email and password</span>
	<ValidatedField
		id="identity"
		label="Username or email"
		placeholder="Username"
		type="text"
		infoObject={info}
		errorObject={errors}
		autocomplete="username,email"
	/>
	<ValidatedField
		id="password"
		label="Password"
		placeholder="Password"
		type="password"
		infoObject={info}
		errorObject={errors}
		autocomplete="current-password"
	/>
	<Button on:click={onClick} variant="outline">Log in</Button>
</div>
