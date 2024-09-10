<script lang="ts">
	import ProfileAuth from '$lib/components/profile/profile-auth.svelte';
	import ProfileInfo from '$lib/components/profile/profile-info.svelte';
	import { breadcrumbStore } from '$lib/stores/navigation';

	$: $breadcrumbStore = [];
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-8">
	<h1 class="h1">Profile</h1>
	<ProfileInfo />
	<h2 class="h2">Linked accounts</h2>
	<ProfileAuth />
</div>
