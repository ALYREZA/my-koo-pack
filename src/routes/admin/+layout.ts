import type { LayoutLoad } from './$types.js';

export const prerender = false;

export const load: LayoutLoad = async () => {
	// Platform data will be accessed directly in components
	return {};
};
