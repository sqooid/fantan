import { mediaQuery } from 'svelte-legos';
import { writable } from 'svelte/store';

export const isMobile = mediaQuery('(max-width: 640px)');
