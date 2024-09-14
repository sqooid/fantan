<script lang="ts">
	import { slide } from 'svelte/transition';
</script>

<div class="fixed top-16 h-1 left-0 right-0" transition:slide={{ duration: 150 }}>
	<div class="loading-item bg-primary h-full w-full" />
</div>

<style lang="postcss">
	.loading-item {
		animation: anim 1.5s infinite linear;
		transform-origin: 0% 50%;
	}
	@keyframes anim {
		0% {
			transform: translateX(0) scaleX(0);
		}
		50% {
			transform: translateX(0) scaleX(0.4);
		}
		100% {
			transform: translateX(100%) scaleX(0.1);
		}
	}
</style>
