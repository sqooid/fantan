<script lang="ts">
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import * as Select from '$lib/shadcn/components/ui/select';
	import { editorOptions, fontOptions, readerOptions } from '$lib/stores/options';
	import type { Selected } from 'bits-ui';

	export let side: string;
	export let language: keyof typeof fontOptions;
	export let reader = false;

	$: options = reader ? readerOptions : editorOptions;

	$: selectOptions = (fontOptions as any)[language];
	$: optionKeys = Object.keys(selectOptions);

	const onSelect = (e: Selected<string> | undefined) => {
		if (e) {
			$options.font[language] = e.value;
		}
	};
</script>

<Label for={`font-${side}`}>{side} font</Label>
<Select.Root
	onSelectedChange={onSelect}
	selected={{ value: $options.font[language], label: $options.font[language] }}
>
	<Select.Trigger>
		<Select.Value placeholder="Font" />
	</Select.Trigger>
	<Select.Content>
		{#each optionKeys as k}
			<Select.Item value={k}>{k}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
