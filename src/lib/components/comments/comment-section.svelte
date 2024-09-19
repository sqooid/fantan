<script lang="ts">
	import { authStore } from '$lib/stores/pocketbase';
	import CommentWrite from './comment-write.svelte';
</script>

<div class="flex flex-col gap-4 max-w-prose mx-auto w-full">
	<h3 class="h3">Comments</h3>
	<CommentWrite />
</div>
