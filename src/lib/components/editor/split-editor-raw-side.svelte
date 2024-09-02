<script lang="ts">
	import { Crepe } from '@milkdown/crepe';
	import '@milkdown/crepe/theme/common/style.css';

	// We have some themes for you to choose
	// available themes: frame, classic, nord, frame-dark, classic-dark, nord-dark
	import '@milkdown/crepe/theme/frame-dark.css';

	export let id: string;

	let elem: HTMLElement;
	$: if (elem) {
		const crepe = new Crepe({
			root: elem,
			defaultValue: 'Hello, Milkdown!',
			features: {
				[Crepe.Feature.ImageBlock]: false,
				[Crepe.Feature.Table]: false,
				[Crepe.Feature.CodeMirror]: false,
				[Crepe.Feature.ListItem]: false
				// [Crepe.Feature.BlockEdit]: {
				// 	handleAddIcon: false
				// }
			}
		});

		crepe.create().then(() => {
			console.log('Editor created');
		});
	}
	// crepe.destroy();
</script>

<div bind:this={elem} />
