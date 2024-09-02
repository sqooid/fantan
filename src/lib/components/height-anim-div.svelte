<script lang="ts">
	import { M, Motion } from 'svelte-motion';
	let height: number | 'auto' = 'auto';

	const o = new ResizeObserver((e) => {
		height = e[0].contentRect.height;
		console.log(height);
	});

	let divElem: HTMLElement;
	$: if (divElem) {
		o.observe(divElem);
	}
</script>

<Motion animate={{ height }} transition={{ duration: 0.15 }} let:motion>
	<div use:motion bind:this={divElem} {...$$props} style:height>
		<slot />
	</div>
</Motion>
