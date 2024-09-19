<script lang="ts">
	import UserAvatar from './user-avatar.svelte';
	import UserHoverCard from './user-hover-card.svelte';

	export let userInfo: CUserType | undefined;
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={userInfo?.avatar} />
	<div class="flex flex-col gap-2">
		<div class="">
			<UserHoverCard {userInfo} />
		</div>
		<div class="milkdown">
			<slot />
		</div>
	</div>
</div>
