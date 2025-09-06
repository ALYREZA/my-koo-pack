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

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
	</div>
{:else if isAuthenticated(authSession)}
	<div class="min-h-screen bg-gray-50">
		<!-- Admin Header -->
		<header class="bg-white shadow-sm border-b">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<div class="flex items-center">
						<h1 class="text-xl font-semibold text-gray-900">Admin Panel</h1>
					</div>
					<div class="flex items-center space-x-4">
						<span class="text-sm text-gray-600">Admin Panel</span>
						<button
							onclick={logout}
							class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
{:else}
	<!-- Login form will be rendered by the login page -->
	{@render children()}
{/if}
