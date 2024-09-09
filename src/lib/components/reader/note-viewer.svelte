<script lang="ts">
	import * as Drawer from '$lib/shadcn/components/ui/drawer';
	import markdownit from 'markdown-it';

	export let notes: Record<string, string>;
	export let open = true;
	export let noteId: string;

	const md = markdownit({ html: false, linkify: true });
	// open links in new tab
	md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const href = token.attrGet('href');
		if (href && href.startsWith('http')) {
			token.attrSet('target', '_blank');
		}
		return self.renderToken(tokens, idx, options);
	};
	$: rendered = md.render(notes[noteId] ?? '');
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger></Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Note</Drawer.Title>
		</Drawer.Header>
		<div class="note-reader p-12">
			{@html rendered}
		</div>
	</Drawer.Content>
</Drawer.Root>
