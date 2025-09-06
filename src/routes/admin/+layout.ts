import type { LayoutLoad } from './$types.js';

export const prerender = false;

export const load: LayoutLoad = async ({ platform }) => {
	// This will be available in the layout component
	return {
		platform: platform || null
	};
};
