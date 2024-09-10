<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/shadcn/components/ui/avatar';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu';
	import { authStore, logOut, pb } from '$lib/stores/pocketbase';
	import { User } from 'lucide-svelte';

	$: avatarUrl = pb.files.getUrl($authStore?.model ?? {}, $authStore?.model?.avatar);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon">
			<Avatar.Root class="">
				<Avatar.Image src={avatarUrl} alt="@shadcn" />
				<Avatar.Fallback>
					<User />
				</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer" on:click={() => goto('/profile')}
				>Profile</DropdownMenu.Item
			>
			<DropdownMenu.Item class="cursor-pointer" on:click={logOut}>Log out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
