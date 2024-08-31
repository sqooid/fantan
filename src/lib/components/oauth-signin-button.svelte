<script lang="ts">
	import { pb } from '$lib/stores/pocketbase';

	export let provider: string;
	export let name: string;

	const onClick = async () => {
		const authData = await $pb.collection('users').authWithOAuth2({ provider });
		// console.log(authData);
	};
</script>

<button type="button" class="btn variant-filled w-fit" on:click={onClick}>
	<span><slot /></span>
	<span>Sign in with {name}</span>
</button>
