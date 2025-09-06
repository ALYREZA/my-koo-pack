<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { AdminCredentials } from '$lib/types/auth.js';
	import { createAuthSession } from '$lib/utils/auth.js';

	let credentials = $state<AdminCredentials>({
		password: ''
	});
	let isLoading = $state(false);
	let error = $state('');

	// Get platform data from the layout
	const platform = $page.data.platform;

	async function handleLogin(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = '';

		try {
			// Get admin password from Cloudflare environment variables
			const adminPassword = platform?.env?.ADMIN_PASSWORD;

			if (!adminPassword) {
				error = 'Admin password not configured';
				return;
			}

			// Validate password
			if (credentials.password === adminPassword) {
				// Create auth session
				const authSession = createAuthSession();
				
				// Store in localStorage
				localStorage.setItem('admin-auth', JSON.stringify(authSession));
				
				// Redirect to admin dashboard
				goto('/admin');
			} else {
				error = 'Invalid password';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'An error occurred during login';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Koo Pack</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Admin Login
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Enter the admin password to access the panel
			</p>
		</div>
		
		<form class="mt-8 space-y-6" onsubmit={handleLogin}>
			<div>
				<label for="password" class="sr-only">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
					placeholder="Enter admin password"
					bind:value={credentials.password}
					disabled={isLoading}
				/>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">
								{error}
							</h3>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{/if}
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>
		</form>
	</div>
</div>
