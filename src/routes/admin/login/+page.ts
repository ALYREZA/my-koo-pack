import type { PageLoad } from './$types.js';

export const prerender = false;

export const load: PageLoad = async ({ parent }) => {
	// Get platform data from parent layout
	const { platform } = await parent();
	
	return {
		platform
	};
};
