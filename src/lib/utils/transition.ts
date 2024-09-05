import { blur, slide } from 'svelte/transition';

export const slideBlur = (
	node: HTMLElement,
	params: Partial<Parameters<typeof slide>[1] & Parameters<typeof blur>[1]>
) => {
	const blurRun = blur(node, params);
	const slideRun = slide(node, params);
	const cssFun = (t: number, u: number) =>
		(blurRun.css?.(t, u) ?? '') + (slideRun.css?.(t, u) ?? '');
	return { ...slideRun, css: cssFun };
};
