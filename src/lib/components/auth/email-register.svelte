<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb, turnstileToken } from '$lib/stores/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import ValidatedField from '../inputs/validated-field.svelte';
	import { parsePbError } from '../inputs/validation';
	import Turnstile from './turnstile.svelte';

	const info = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		turnstileToken: ''
	};
	let errors: Record<string, string> | null = null;

	const onClick = async () => {
		try {
			if (!$turnstileToken) {
				toast.error('Please wait for human verification');
				return;
			}
			info.turnstileToken = $turnstileToken;
			await pb.collection('users').create(info);
			await pb.collection('users').authWithPassword(info.username, info.password);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				if (error.message.startsWith('Invalid token')) {
					toast.error('Please complete human verification');
				}
			}

			errors = parsePbError(error);
		}
	};
</script>

<div class="flex flex-col gap-2 w-full">
	<span class="large">Create a new account</span>
	<ValidatedField
		required
		id="username"
		label="Username"
		placeholder="john"
		type="text"
		infoObject={info}
		errorObject={errors}
		autocomplete="username"
	/>
	<ValidatedField
		id="email"
		label="Email"
		placeholder="john@example.com"
		type="email"
		infoObject={info}
		errorObject={errors}
		autocomplete="email"
	/>
	<ValidatedField
		required
		id="password"
		label="Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
		autocomplete="new-password"
	/>
	<ValidatedField
		required
		id="passwordConfirm"
		label="Confirm Password"
		placeholder="password"
		type="password"
		infoObject={info}
		errorObject={errors}
		autocomplete="new-password"
	/>
	<Button variant="outline" on:click={onClick}>Sign up</Button>
</div>

<Turnstile />
