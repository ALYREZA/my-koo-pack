<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AdminCredentials } from '$lib/types/auth.js';
	import { createAuthSession } from '$lib/utils/auth.js';

	interface LoginResponse {
		success: boolean;
		error?: string;
		message?: string;
	}

	let credentials = $state<AdminCredentials>({
		password: ''
	});
	let isLoading = $state(false);
	let error = $state('');

	async function handleLogin(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = '';

		try {
			// Send login request to server
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					password: credentials.password
				})
			});

			const result = await response.json() as LoginResponse;

			if (result.success) {
				// Create auth session
				const authSession = createAuthSession();
				
				// Store in localStorage
				localStorage.setItem('admin-auth', JSON.stringify(authSession));
				
				// Redirect to admin dashboard
				goto('/admin');
			} else {
				error = result.error || 'Login failed';
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

<style>
	/* Custom animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}

	@keyframes pulse-slow {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out;
	}

	.float {
		animation: float 6s ease-in-out infinite;
	}

	.pulse-slow {
		animation: pulse-slow 2s ease-in-out infinite;
	}

	.glass {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.gradient-text {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.shimmer {
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
</style>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float" style="animation-delay: -3s;"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pulse-slow"></div>
	</div>

	<div class="max-w-md w-full space-y-8 relative z-10">
		<div class="text-center animate-fade-in-up">
			<h2 class="mt-6 text-3xl font-extrabold text-white gradient-text">
				Admin Login
			</h2>
			<p class="mt-2 text-sm text-gray-300">
				Enter the admin password to access the panel
			</p>
		</div>
		
		<div class="glass rounded-xl p-8 animate-fade-in-up" style="animation-delay: 0.2s;">
			<form class="space-y-6" onsubmit={handleLogin}>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="relative block w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
						placeholder="Enter admin password"
						bind:value={credentials.password}
						disabled={isLoading}
					/>
				</div>

				{#if error}
					<div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-200">
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
						class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
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
</div>
