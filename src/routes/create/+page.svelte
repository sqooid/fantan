<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/pocketbase';

	if (browser && $authStore?.isValid) {
		goto('/edit/novels');
	}
</script>

<span>Create an account and log in to start creating</span>
