<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Input from '$lib/shadcn/components/ui/input/input.svelte';
	import Label from '$lib/shadcn/components/ui/label/label.svelte';
	import { randomId } from '$lib/utils/ui';
	import * as Tooltip from '$lib/shadcn/components/ui/tooltip';

	export let label: string;
	export let type: 'text' | 'email' | 'password' | 'file';
	export let id: string;
	export let placeholder = '';
	export let accept = '';
	export let infoObject: { [K in typeof id]: string };
	export let errorObject: { [K in typeof id]: string } | null;
	export let autocomplete = '';
	export let required = false;
	export let files: FileList | null = null;

	$: errors = errorObject ?? {};
	$: classes = `input ${$$props.class ?? ''} ${errors[id] ? 'input-error' : ''}`;

	export const getFiles = () => {
		return files;
	};
	const elementId = randomId();

	const onFileInput = (e: InputEvent) => {
		const elem = e.target as HTMLInputElement;
		files = elem.files;
	};
</script>

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
			id={elementId}
			type="file"
			class={classes}
			{accept}
			title={label}
			{autocomplete}
			on:input={onFileInput}
		/>
	{/if}
</div>
{#if errors[id]}
	<small class="variant-soft-error p-1 rounded-full w-fit">{errors[id]}</small>
{/if}
