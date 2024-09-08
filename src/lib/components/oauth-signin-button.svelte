<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb } from '$lib/stores/pocketbase';
	import { mode } from 'mode-watcher';

	export let provider: string;
	export let name: string;

	const onClick = async () => {
		const authData = await pb.collection('users').authWithOAuth2({ provider });
	};
</script>

<Button
	on:click={onClick}
	variant={$mode === 'light' ? 'outline' : 'default'}
	class={`${$$props.class ?? ''}`}
>
	<span><slot /></span>
	<span>Sign in with {name}</span>
</Button>
