import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createClient } from '@supabase/supabase-js';
import type { Request } from '$lib/types/auth.js';

/**
 * Create Supabase client using platform environment variables
 */
function createSupabaseClient(platform: any) {
	if (!platform?.env?.SUPABASE_URL || !platform?.env?.SUPABASE_KEY) {
		return null;
	}
	
	return createClient(platform.env.SUPABASE_URL, platform.env.SUPABASE_KEY);
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const { code } = await request.json() as { code: string };

		if (!code || typeof code !== 'string') {
			return json({ error: 'Code is required' }, { status: 400 });
		}

		// Validate code format (3 letters + 3 numbers)
		const codeRegex = /^[A-Z]{3}[0-9]{3}$/;
		if (!codeRegex.test(code.toUpperCase())) {
			return json({ error: 'Invalid code format' }, { status: 400 });
		}

		const supabase = createSupabaseClient(platform);
		if (!supabase) {
			return json({ error: 'Database connection not available' }, { status: 500 });
		}

		// Search for the code in the database
		const { data, error } = await supabase
			.from('requests')
			.select('*')
			.eq('code', code.toUpperCase())
			.single();

		if (error) {
			if ((error as any).code === 'PGRST116') {
				// No rows returned - code not found
				return json({ found: false });
			}
			console.error('Supabase error:', error);
			return json({ error: 'Database error occurred' }, { status: 500 });
		}

		if (data) {
			const request: Request = {
				id: data.id,
				mobile: data.mobile,
				code: data.code,
				status: data.status,
				payload: data.payload,
				created_at: data.created_at,
				updated_at: data.updated_at
			};

			return json({ found: true, entry: request });
		}

		return json({ found: false });

	} catch (error) {
		console.error('Track API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
