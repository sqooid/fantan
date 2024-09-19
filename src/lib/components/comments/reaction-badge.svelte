<script lang="ts">
	import { Badge } from '$lib/shadcn/components/ui/badge';

	export let reaction: string;
	export let count: number;
</script>

<Badge variant="outline">
	<span> {reaction} {count} </span>
</Badge>
