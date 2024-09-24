<script lang="ts">
	import * as Avatar from '$lib/shadcn/components/ui/avatar';
	import { User } from 'lucide-svelte';
	export let avatarUrl = '';
</script>

<Avatar.Root class={`${$$props.class ?? ''}`}>
	<Avatar.Image src={avatarUrl} alt="User avatar" />
	<Avatar.Fallback>
		<User />
	</Avatar.Fallback>
</Avatar.Root>
