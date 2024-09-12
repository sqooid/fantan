<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import Switch from '$lib/shadcn/components/ui/switch/switch.svelte';
	import { isMobile } from '$lib/stores/breakpoints';
	import { readerInfo, readerOptions } from '$lib/stores/options';
	import { Settings2 } from 'lucide-svelte';
	import ReaderFontOption from './reader-font-option.svelte';

	export let open = true;
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger asChild let:builder>
		<div class="flex justify-center">
			<Button
				builders={[builder]}
				class="mx-auto"
				variant="ghost"
				title="Reader options"
				size="icon"
			>
				<Settings2 />
			</Button>
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Reader options</Drawer.Title>
		</Drawer.Header>
		<div class="p-16 pt-4 flex flex-col sm:grid grid-cols-3 gap-4">
			<div class="flex flex-col gap-4">
				<h3 class="h3">Content</h3>
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
			<div class="flex flex-col gap-4">
				<h3 class="h3">Font</h3>
				<div class="grid grid-cols-[auto_1fr] items-center gap-4">
					<ReaderFontOption side="Source" language={$readerInfo.language.source} />
					<ReaderFontOption side="Translated" language={$readerInfo.language.translated} />
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
