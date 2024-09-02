<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Tooltip from './tooltip.svelte';

	export let label: string;
	export let type: 'text' | 'email' | 'password' | 'file';
	export let id: string;
	export let placeholder = '';
	export let accept = '';
	export let infoObject: { [K in typeof id]: string };
	export let errorObject: { [K in typeof id]: string } | null;
	export let autocomplete = '';
	export let required = false;

	$: errors = errorObject ?? {};
	$: classes = `input ${$$props.class ?? ''} ${errors[id] ? 'input-error' : ''}`;

	export const getFiles = () => {
		return fileInput.files;
	};

	let fileInput: HTMLInputElement;
</script>

<label class="label">
	{#if required}
		<Tooltip text={`${label} *`} event="hover">Field is required</Tooltip>
	{:else}
		<span>
			{label}
		</span>
	{/if}
	<slot />
	{#if type === 'text'}
		<input
			type="text"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
			on:input
		/>
	{:else if type === 'email'}
		<input
			type="email"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
			on:input
		/>
	{:else if type === 'password'}
		<input
			type="password"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
			on:input
		/>
	{:else if type === 'file'}
		<input
			bind:this={fileInput}
			type="file"
			class={classes}
			{accept}
			title={label}
			{autocomplete}
			on:input
		/>
	{/if}
</label>
{#if errors[id]}
	<small class="variant-soft-error p-1 rounded-full w-fit">{errors[id]}</small>
{/if}
