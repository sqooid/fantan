<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { breadcrumbStore } from '$lib/stores/navigation';
	import { authStore } from '$lib/stores/pocketbase';

	if (browser && $authStore?.isValid) {
		goto('/edit/novels');
	}

	$: $breadcrumbStore = [
		{ title: 'Home', href: '/' },
		{ title: 'Create', href: '/create' }
	];
</script>

<div class="w-full h-full p-8">
	<h4 class="mx-auto w-fit">
		Create an account and <a href="/login" class="anchor">login</a> to start creating
	</h4>
</div>
