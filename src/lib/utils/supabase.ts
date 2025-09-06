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

/**
 * Add a new request to Supabase
 */
export async function addRequest(mobile: string, code: string, platform: any): Promise<{ success: boolean; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { success: false, error: 'Supabase client not initialized' };
	}

	try {
		const { error } = await supabase
			.from('requests')
			.insert({
				mobile: mobile.replace(/\D/g, ''), // Store clean mobile number
				code,
				status: 'registered',
				payload: null,
				created_at: new Date().toISOString(),
				updated_at: null
			});

		if (error) {
			console.error('Supabase error:', error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error('Error adding request:', error);
		return { success: false, error: 'Failed to add request' };
	}
}

/**
 * Get all requests from Supabase
 */
export async function getRequests(platform: any): Promise<{ data: Request[] | null; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { data: null, error: 'Supabase client not initialized' };
	}

	try {
		const { data, error } = await supabase
			.from('requests')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Supabase error:', error);
			return { data: null, error: error.message };
		}

		return { data: data as Request[] };
	} catch (error) {
		console.error('Error fetching requests:', error);
		return { data: null, error: 'Failed to fetch requests' };
	}
}

/**
 * Update request status
 */
export async function updateRequestStatus(id: string, status: string, platform: any): Promise<{ success: boolean; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { success: false, error: 'Supabase client not initialized' };
	}

	try {
		const { error } = await supabase
			.from('requests')
			.update({ 
				status: status,
				updated_at: new Date().toISOString()
			})
			.eq('id', id);

		if (error) {
			console.error('Supabase error:', error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error('Error updating request:', error);
		return { success: false, error: 'Failed to update request' };
	}
}
