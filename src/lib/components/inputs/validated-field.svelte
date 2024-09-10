<script lang="ts">
	import Input from '$lib/shadcn/components/ui/input/input.svelte';
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import * as Select from '$lib/shadcn/components/ui/select';
	import Textarea from '$lib/shadcn/components/ui/textarea/textarea.svelte';
	import * as Tooltip from '$lib/shadcn/components/ui/tooltip';
	import { randomId } from '$lib/utils/ui';
	import type { Selected } from 'bits-ui';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let label: string;
	export let type: 'text' | 'email' | 'password' | 'file' | 'textarea' | 'select';
	export let id: string;
	export let placeholder = '';
	export let accept = '';
	export let infoObject: { [K in typeof id]: string };
	export let errorObject: { [K in typeof id]: string } | null;
	export let autocomplete = '';
	export let required = false;
	export let files: FileList | null = null;
	export let selectOptions: { value: string; label: string }[] = [];
	export let disabled = false;

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
		{#if required}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Label for={elementId}>{label}*</Label>
				</Tooltip.Trigger>
				<Tooltip.Content>Field is required</Tooltip.Content>
			</Tooltip.Root>
		{:else}
			<Label for={elementId}>{label}</Label>
		{/if}
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
