<script lang="ts">
	import * as HoverCard from '$lib/shadcn/components/ui/hover-card';
	import moment from 'moment';
	import UserAvatar from './user-avatar.svelte';

	export let userInfo: CUserType | undefined;
	$: name = userInfo?.name || userInfo?.username;
	$: created = moment(userInfo?.created).format('d MMMM YYYY');
</script>

<HoverCard.Root>
	<HoverCard.Trigger
		href={`/users/${userInfo?.id}`}
		target="_blank"
		class="hover:underline underline-offset-2 small">{name}</HoverCard.Trigger
	>
	<HoverCard.Content class="max-w-xl w-fit">
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<UserAvatar avatarUrl={userInfo?.avatar} />
			<div class="flex flex-col gap-2">
				<span class="large">{name}</span>
				<span class="muted">Joined on {created}</span>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
