export interface AdminCredentials {
	password: string;
}

export interface Request {
	id: string;
	mobile: string;
	code: string;
	status: string;
	payload: string | null;
	created_at: string;
	updated_at: string | null;
}

export interface AuthSession {
	isAuthenticated: boolean;
}
