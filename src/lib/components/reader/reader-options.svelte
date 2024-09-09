<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import Switch from '$lib/shadcn/components/ui/switch/switch.svelte';
	import { isMobile } from '$lib/stores/breakpoints';
	import { readerOptions } from '$lib/stores/options';
	import { Settings2 } from 'lucide-svelte';

	export let open = false;
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger asChild let:builder>
		<div class="flex justify-center">
			<Button builders={[builder]} class="mx-auto w-fit" variant="ghost">
				<Settings2 size="24" />
			</Button>
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Reader options</Drawer.Title>
		</Drawer.Header>
		<div class="p-16 flex flex-col gap-4">
			{#if !$isMobile}
				<div class="flex items-center gap-4">
					<Switch bind:checked={$readerOptions.aligned} id="aligned" />
					<Label for="aligned">Align paragraphs</Label>
				</div>
			{/if}
			<div class="flex items-center gap-4">
				<Switch bind:checked={$readerOptions.showSource} id="aligned" />
				<Label for="aligned">Show source language</Label>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
