<script lang="ts">
	import { authStore } from '$lib/stores/pocketbase';
	import { Editor, rootCtx } from '@milkdown/kit/core';
	import UserAvatar from './user-avatar.svelte';
	import { commonmark } from '@milkdown/kit/preset/commonmark';
	import { clipboard } from '@milkdown/kit/plugin/clipboard';
	import { history } from '@milkdown/kit/plugin/history';
	import { onDestroy } from 'svelte';
	import { addEventListeners, renderMilkdown } from '../editor/event-listeners';
	import { emojiPlugin } from './emoji-plugin';
	import Button from '$lib/shadcn/components/ui/button/button.svelte';

	$: avatar = $authStore?.model?.avatar;
	$: loggedIn = $authStore?.isValid;

	let showPlaceholder = true;

	let milkdownEditor: Editor | null = null;

	const editor = (e: HTMLElement) => {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, e);
			})
			.use(commonmark)
			.use(clipboard)
			.use(history)
			.use(emojiPlugin)
			.create()
			.then((editor) => {
				milkdownEditor = editor;
				addEventListeners(editor, {
					onEmptyChange(value) {
						showPlaceholder = value;
					}
				});
			});
	};
	onDestroy(() => {
		milkdownEditor?.destroy();
	});

	const onPost = () => {};
</script>

<div class="grid grid-cols-[auto_1fr] gap-x-4">
	<UserAvatar avatarUrl={avatar} />
	{#if loggedIn}
		<div>
			<div use:editor class="milkdown p-4 border border-solid rounded-md relative mb-4">
				{#if showPlaceholder}
					<div class="absolute pointer-events-none opacity-30 inset-0 flex items-center pl-4">
						<span>Write a comment</span>
					</div>
				{/if}
			</div>
			<Button on:click={onPost}>Post comment</Button>
		</div>
	{:else}
		<div class="h-full flex items-center">
			<span>
				<a href="/login" class="anchor">Log in</a> to start commenting
			</span>
		</div>
	{/if}
</div>
