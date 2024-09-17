<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { authStore, pb } from '$lib/stores/pocketbase';
	import { mode } from 'mode-watcher';

	export let provider: string;
	export let unlink = false;

	const onClick = async () => {
		if (!unlink) await pb.collection('users').authWithOAuth2({ provider });
		else if ($authStore?.model?.id)
			await pb.collection('users').unlinkExternalAuth($authStore.model.id, provider);
	};
</script>

<Button
	on:click={onClick}
	variant={$mode === 'light' ? 'outline' : 'default'}
	class={`${$$props.class ?? ''}`}
>
	<slot></slot>
</Button>
