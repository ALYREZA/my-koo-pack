export interface AdminCredentials {
	password: string;
}

export interface MobileEntry {
	id: string;
	mobile: string;
	code: string;
	createdAt: string;
	used: boolean;
}

export interface AuthSession {
	isAuthenticated: boolean;
}
