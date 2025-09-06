import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json() as { password?: string };
		const { password } = body;

		if (!password) {
			return json({ success: false, error: 'Password is required' }, { status: 400 });
		}

		// Get admin password from Cloudflare environment variables
		const adminPassword = platform?.env?.Authorization;

		if (!adminPassword) {
			return json({ success: false, error: 'Admin password not configured' }, { status: 500 });
		}

		// Validate password
		if (password === adminPassword) {
			return json({ success: true, message: 'Login successful' });
		} else {
			return json({ success: false, error: 'Invalid password' }, { status: 401 });
		}
	} catch (error) {
		console.error('Login API error:', error);
		return json({ success: false, error: 'An error occurred during login' }, { status: 500 });
	}
};
