<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte';
	import Input from '$lib/shadcn/components/ui/input/input.svelte';
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import * as Select from '$lib/shadcn/components/ui/select';
	import Textarea from '$lib/shadcn/components/ui/textarea/textarea.svelte';
	import * as Tooltip from '$lib/shadcn/components/ui/tooltip';
	import { randomId } from '$lib/utils/ui';
	import type { Selected } from 'bits-ui';
	import { Info } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let label: string;
	export let type: 'text' | 'number' | 'email' | 'password' | 'file' | 'textarea' | 'select';
	export let tooltipIcon = Info;
	export let id: string;
	export let placeholder = '';
	export let accept = '';
	export let infoObject: { [K in typeof id]: string } | any;
	export let errorObject: { [K in typeof id]: string } | null;
	export let autocomplete = '';
	export let required = false;
	export let files: FileList | null = null;
	export let selectOptions: { value: string; label: string }[] = [];
	export let disabled = false;
	export let tooltip = false;

	$: errors = errorObject ?? {};
	$: classes = `input ${$$props.class ?? ''} ${errors[id] ? 'input-error' : ''}`;

	export const getFiles = () => {
		return files;
	};

	const dispatch = createEventDispatcher();
	const elementId = randomId();

	const onFileInput = (e: InputEvent) => {
		const elem = e.target as HTMLInputElement;
		files = elem.files;
	};

	let selected: { value: string; label: string } =
		selectOptions.find((x) => x.value === infoObject[id]) ?? selectOptions[0];

	let loaded = false;

	const onSelectedChange = (e: Selected<string> | undefined) => {
		infoObject[id] = e?.value ?? '';
		dispatch('input');
	};
</script>

<div>
	<div class="label">
		<Label for={elementId} class="relative"
			>{label}{required ? '*' : ''}
			{#if tooltip}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button builders={[builder]} variant="ghost" class="h-fit w-fit p-1" size="icon">
							<svelte:component this={tooltipIcon} class="w-3 h-3 p-0" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content class="max-w-sm">
						<slot name="tooltip-content" />
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</Label>
		<slot />
		{#if type === 'text'}
			<Input
				{disabled}
				id={elementId}
				type="text"
				class={classes}
				title={label}
				placeholder={placeholder || label}
				bind:value={infoObject[id]}
				{autocomplete}
				on:input
			/>
		{:else if type === 'number'}
			<Input
				{disabled}
				id={elementId}
				type="number"
				class={classes}
				title={label}
				placeholder={placeholder || label}
				bind:value={infoObject[id]}
				{autocomplete}
				on:input
			/>
		{:else if type === 'email'}
			<Input
				{disabled}
				id={elementId}
				type="email"
				class={classes}
				title={label}
				placeholder={placeholder || label}
				bind:value={infoObject[id]}
				{autocomplete}
				on:input
			/>
		{:else if type === 'password'}
			<Input
				{disabled}
				id={elementId}
				type="password"
				class={classes}
				title={label}
				placeholder={placeholder || label}
				bind:value={infoObject[id]}
				{autocomplete}
				on:input
			/>
		{:else if type === 'file'}
			<Input
				{disabled}
				id={elementId}
				type="file"
				class={classes}
				{accept}
				title={label}
				{autocomplete}
				on:input={onFileInput}
			/>
		{:else if type === 'textarea'}
			<Textarea
				{disabled}
				id={elementId}
				class={classes}
				title={label}
				{autocomplete}
				bind:value={infoObject[id]}
				on:input
			/>
		{:else if type === 'select'}
			<Select.Root {selected} {onSelectedChange} {disabled}>
				<Select.Trigger class="">
					<Select.Value {placeholder} />
				</Select.Trigger>
				<Select.Content>
					{#each selectOptions as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/if}
	</div>
	{#if errors[id]}
		<div transition:slide>
			<small class="text-destructive p-1 rounded-full w-fit"> {errors[id]}</small>
		</div>
	{/if}
</div>
