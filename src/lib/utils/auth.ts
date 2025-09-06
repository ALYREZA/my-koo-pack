import type { AdminCredentials, AuthSession } from '$lib/types/auth.js';

/**
 * Generate a human-readable code for mobile verification
 * Format: 3 letters + 3 numbers (e.g., ABC123)
 */
export function generateHumanReadableCode(): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';
	
	let code = '';
	
	// Generate 3 random letters
	for (let i = 0; i < 3; i++) {
		code += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	
	// Generate 3 random numbers
	for (let i = 0; i < 3; i++) {
		code += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}
	
	return code;
}

/**
 * Validate mobile number format
 */
export function validateMobileNumber(mobile: string): boolean {
	// Remove all non-digit characters
	const cleanMobile = mobile.replace(/\D/g, '');
	
	// Check if it's a valid mobile number (10-15 digits)
	return cleanMobile.length >= 10 && cleanMobile.length <= 15;
}

/**
 * Format mobile number for display
 */
export function formatMobileNumber(mobile: string): string {
	const cleanMobile = mobile.replace(/\D/g, '');
	
	if (cleanMobile.length === 10) {
		return `(${cleanMobile.slice(0, 3)}) ${cleanMobile.slice(3, 6)}-${cleanMobile.slice(6)}`;
	}
	
	return cleanMobile;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: AuthSession | null): boolean {
	return session?.isAuthenticated === true;
}

/**
 * Create authentication session
 */
export function createAuthSession(): AuthSession {
	return {
		isAuthenticated: true
	};
}

/**
 * Clear authentication session
 */
export function clearAuthSession(): AuthSession {
	return {
		isAuthenticated: false
	};
}
