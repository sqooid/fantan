<script lang="ts">
	import * as Breadcrumb from '$lib/shadcn/components/ui/breadcrumb';
	import { breadcrumbStore } from '$lib/stores/navigation';
</script>

{#if $breadcrumbStore.length !== 0}
	<Breadcrumb.Root class="py-4 px-8 w-full">
		<Breadcrumb.List>
			{#each $breadcrumbStore as item, i}
				{#if i > 0}
					<Breadcrumb.Separator />
				{/if}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={item.href}>{item.title}</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
{/if}
