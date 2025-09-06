// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
            env: {
                ADMIN_PASSWORD?: string;
                SUPABASE_URL?: string;
                SUPABASE_KEY?: string;
                Authorization?: string;
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {};