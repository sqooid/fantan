<script lang="ts">
	export let label: string;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let id: string;
	export let placeholder = '';
	export let infoObject: { [K in typeof id]: string };
	export let errorObject: { [K in typeof id]: string };
	export let autocomplete = '';
	$: classes = `input ${$$props.class ?? ''} ${errorObject[id] ? 'input-error' : ''}`;
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
	{/if}
</label>
{#if errorObject[id]}
	<small class="variant-soft-error p-1 rounded-full w-fit">{errorObject[id]}</small>
{/if}
