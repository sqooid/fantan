<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let text: string;
	export let event: PopupSettings['event'] = 'focus-click';
	export let placement: PopupSettings['placement'] = 'top';

	const target = Math.random().toString().slice(2);
	const popupSettings: PopupSettings = {
		event,
		target,
		placement
	};
</script>

<div class="[&>*]:pointer-events-none w-fit" use:popup={popupSettings}>
	<span class="cursor-pointer">{text}</span>
</div>
<div class="card p-4 variant-filled-primary" data-popup={target}>
	<slot />
	<div class="arrow variant-filled-primary" />
</div>
