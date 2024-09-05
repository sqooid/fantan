<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import * as Collapsible from '$lib/shadcn/components/ui/collapsible';
	import { ChevronsUpDown } from 'lucide-svelte';
	import EditTipItem from './edit-tip-item.svelte';
</script>

<Collapsible.Root>
	<span class="text-sm font-semibold">Editor controls</span>
	<Collapsible.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
			<ChevronsUpDown class="h-4 w-4" />
			<span class="sr-only">Toggle</span>
		</Button>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex flex-wrap gap-4 py-4">
		<div class="grid grid-cols-2 gap-2 auto-rows-min">
			<EditTipItem keys={['Ctrl', 'B']}><strong>**Bold**</strong></EditTipItem>
			<EditTipItem keys={['Ctrl', 'I']}><em>*Italic*</em></EditTipItem>
			<EditTipItem keys={['Ctrl', 'Alt', 'C']}><code>`Code`</code></EditTipItem>
		</div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-2 auto-rows-min">
			<EditTipItem keys={['Ctrl', 'Alt', '1']}><span># Header 1</span></EditTipItem>
			<EditTipItem keys={['Ctrl', 'Alt', '2']}><span>## Header 2</span></EditTipItem>
			<EditTipItem keys={['Ctrl', 'Alt', '3']}><span>### Header 3</span></EditTipItem>
			<EditTipItem keys={['Ctrl', 'Alt', '4']}><span>#### Header 4</span></EditTipItem>
		</div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-2 auto-rows-min">
			<EditTipItem keys={['Ctrl', 'Alt', '7']}><span>1. Numbered list</span></EditTipItem>
			<EditTipItem keys={['Ctrl', 'Alt', '8']}><span>- Bullet list</span></EditTipItem>
		</div>
		<div class="grid grid-cols-2 gap-x-1 gap-y-2 auto-rows-min">
			<EditTipItem keys={['Ctrl', 'Shift', 'B']}><span>> Blockquote</span></EditTipItem>
			<EditTipItem><span>--- Horizontal</span></EditTipItem>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
