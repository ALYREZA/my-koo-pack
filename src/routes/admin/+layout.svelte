<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { AuthSession } from '$lib/types/auth.js';
	import { isAuthenticated, clearAuthSession } from '$lib/utils/auth.js';

	let { children } = $props();

	let authSession = $state<AuthSession>({ isAuthenticated: false });
	let isLoading = $state(true);

	// Check authentication status on mount
	onMount(() => {
		checkAuthStatus();
	});

	function checkAuthStatus() {
		const stored = localStorage.getItem('admin-auth');
		if (stored) {
			try {
				authSession = JSON.parse(stored);
			} catch (error) {
				console.error('Error parsing auth session:', error);
				authSession = clearAuthSession();
			}
		}
		isLoading = false;
	}

	function logout() {
		authSession = clearAuthSession();
		localStorage.removeItem('admin-auth');
		goto('/admin/login');
	}

	// Redirect to login if not authenticated and not on login page
	$effect(() => {
		if (!isLoading && !isAuthenticated(authSession) && $page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});
</script>

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

{#if isLoading}
	<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
		<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
	</div>
{:else if isAuthenticated(authSession)}
	<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
		<!-- Animated background elements -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float"></div>
			<div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float" style="animation-delay: -3s;"></div>
			<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pulse-slow"></div>
		</div>

		<!-- Admin Header -->
		<header class="relative z-10 glass border-b border-white/20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<div class="flex items-center">
						<h1 class="text-xl font-semibold text-white gradient-text">Admin Panel</h1>
					</div>
					<div class="flex items-center space-x-4">
						<span class="text-sm text-gray-300">Admin Panel</span>
						<button
							onclick={logout}
							class="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
{:else}
	<!-- Login form will be rendered by the login page -->
	{@render children()}
{/if}
