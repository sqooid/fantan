<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { pb } from '$lib/stores/pocketbase';

	export let provider: string;
	export let name: string;

	const onClick = async () => {
		const authData = await pb.collection('users').authWithOAuth2({ provider });
	};
</script>

<Button on:click={onClick}>
	<span><slot /></span>
	<span>Sign in with {name}</span>
</Button>
