<script lang="ts">
	export let label: string;
	export let type: 'text' | 'email' | 'password' | 'file';
	export let id: string;
	export let placeholder = '';
	export let accept = '';
	export let infoObject: { [K in typeof id]: string };
	export let errorObject: { [K in typeof id]: string } | null;
	export let autocomplete = '';

	$: errors = errorObject ?? {};
	$: classes = `input ${$$props.class ?? ''} ${errors[id] ? 'input-error' : ''}`;
</script>

<label class="label">
	<span>{label}</span>
	<slot />
	{#if type === 'text'}
		<input
			type="text"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
		/>
	{:else if type === 'email'}
		<input
			type="email"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
		/>
	{:else if type === 'password'}
		<input
			type="password"
			class={classes}
			title={label}
			placeholder={placeholder || label}
			bind:value={infoObject[id]}
			{autocomplete}
		/>
	{:else if type === 'file'}
		<input
			type="file"
			class={classes}
			{accept}
			title={label}
			bind:value={infoObject[id]}
			{autocomplete}
		/>
	{/if}
</label>
{#if errors[id]}
	<small class="variant-soft-error p-1 rounded-full w-fit">{errors[id]}</small>
{/if}
