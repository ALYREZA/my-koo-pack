import { createClient } from '@supabase/supabase-js';
import type { MobileEntry } from '$lib/types/auth.js';

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
 * Add a new mobile entry to Supabase
 */
export async function addMobileEntry(mobile: string, code: string, platform: any): Promise<{ success: boolean; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { success: false, error: 'Supabase client not initialized' };
	}

	try {
		const { error } = await supabase
			.from('mobile_entries')
			.insert({
				mobile: mobile.replace(/\D/g, ''), // Store clean mobile number
				code,
				created_at: new Date().toISOString(),
				used: false
			});

		if (error) {
			console.error('Supabase error:', error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error('Error adding mobile entry:', error);
		return { success: false, error: 'Failed to add mobile entry' };
	}
}

/**
 * Get all mobile entries from Supabase
 */
export async function getMobileEntries(platform: any): Promise<{ data: MobileEntry[] | null; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { data: null, error: 'Supabase client not initialized' };
	}

	try {
		const { data, error } = await supabase
			.from('mobile_entries')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Supabase error:', error);
			return { data: null, error: error.message };
		}

		return { data: data as MobileEntry[] };
	} catch (error) {
		console.error('Error fetching mobile entries:', error);
		return { data: null, error: 'Failed to fetch mobile entries' };
	}
}

/**
 * Mark a mobile entry as used
 */
export async function markMobileEntryAsUsed(id: string, platform: any): Promise<{ success: boolean; error?: string }> {
	const supabase = createSupabaseClient(platform);
	if (!supabase) {
		return { success: false, error: 'Supabase client not initialized' };
	}

	try {
		const { error } = await supabase
			.from('mobile_entries')
			.update({ used: true })
			.eq('id', id);

		if (error) {
			console.error('Supabase error:', error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error('Error updating mobile entry:', error);
		return { success: false, error: 'Failed to update mobile entry' };
	}
}
