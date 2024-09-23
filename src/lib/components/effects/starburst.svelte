<script lang="ts">
	import { mapToCssVars } from '$lib/utils/ui';

	export let midOffset = '5px';
	export let maxOffset = '10px';
	export let width = '2px';
	export let durationMs = 500;
	export let maxLength = '6px';

	let show = false;
	let timer: NodeJS.Timeout;

	export const showStarburst = () => {
		if (timer) {
			clearTimeout(timer);
			show = false;
		}
		timer = setTimeout(() => {
			show = false;
		}, durationMs);
		show = true;
	};

	const varClass = mapToCssVars({
		midOffset,
		width,
		duration: `${durationMs}ms`,
		maxLength,
		maxOffset
	});
</script>

<div class={`absolute inset-0 flex items-center justify-center`}>
	<div class={`w-0 h-0 relative ${show ? 'show-starburst' : ''}`} style={varClass}>
		<div class={`line `} style="--angle:0deg"></div>
		<div class={`line `} style="--angle:45deg"></div>
		<div class={`line `} style="--angle:90deg"></div>
		<div class={`line `} style="--angle:135deg"></div>
		<div class={`line `} style="--angle:180deg"></div>
		<div class={`line `} style="--angle:225deg"></div>
		<div class={`line `} style="--angle:270deg"></div>
		<div class={`line `} style="--angle:315deg"></div>
	</div>
</div>

<style lang="postcss">
	.line {
		width: 0px;
		height: 0px;
		transform-origin: top;
		transform: rotate(var(--angle)) translateY(var(--midOffset));
		@apply bg-primary absolute rounded-full;
	}

	.show-starburst .line {
		animation: animate var(--duration) infinite;
	}

	@keyframes animate {
		0% {
			width: 3px;
			height: 0px;
			opacity: 0;
			transform: rotate(var(--angle)) translateY(var(--midOffset));
		}
		2% {
			width: var(--width);
			height: var(--maxLength);
			opacity: 1;
			transform: rotate(var(--angle)) translateY(var(--midOffset));
		}
		100% {
			width: 0px;
			height: 0px;
			opacity: 1;
			transform: rotate(var(--angle)) translateY(var(--maxOffset));
		}
	}
</style>
