<script lang="ts">
	import { onMount } from 'svelte';
	import type { Request } from '$lib/types/auth.js';
	import { formatMobileNumber } from '$lib/utils/auth.js';

	let code = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let result = $state<Request | null>(null);
	let notFound = $state(false);

	async function trackCode() {
		if (!code.trim()) {
			error = 'Please enter a code';
			return;
		}

		isLoading = true;
		error = '';
		result = null;
		notFound = false;

		try {
			const response = await fetch('/api/track', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code: code.trim().toUpperCase() })
			});

			const data = await response.json() as { found?: boolean; entry?: Request; error?: string };

			if (response.ok) {
				if (data.found) {
					result = data.entry || null;
				} else {
					notFound = true;
				}
			} else {
				error = data.error || 'An error occurred while tracking the code';
			}
		} catch (err) {
			console.error('Tracking error:', err);
			error = 'Failed to track code. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function clearResult() {
		result = null;
		notFound = false;
		error = '';
		code = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			trackCode();
		}
	}
</script>

<svelte:head>
	<title>Track Your Code - Koo Pack</title>
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

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float" style="animation-delay: -3s;"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pulse-slow"></div>
	</div>

	<div class="max-w-2xl mx-auto relative z-10">
		<!-- Header -->
		<div class="text-center mb-8 animate-fade-in-up">
			<h1 class="text-3xl font-bold text-white gradient-text mb-2">Track Your Code</h1>
			<p class="text-gray-300">Enter your code to check its status and details</p>
		</div>

		<!-- Code Input Form -->
		<div class="glass rounded-xl p-6 mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
			<form onsubmit={(e) => { e.preventDefault(); trackCode(); }} class="space-y-4">
				<div>
					<label for="code" class="block text-sm font-medium text-gray-300 mb-2">
						Enter Your Code
					</label>
					<input
						id="code"
						type="text"
						placeholder="e.g., ABC123"
						bind:value={code}
						onkeypress={handleKeyPress}
						disabled={isLoading}
						class="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
						maxlength="6"
					/>
					<p class="mt-2 text-sm text-gray-400">Enter the 6-character code you received</p>
				</div>

				<button
					type="submit"
					disabled={isLoading || !code.trim()}
					class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Tracking...
					{:else}
						Track Code
					{/if}
				</button>
			</form>
		</div>

		<!-- Error Message -->
		{#if error}
			<div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 animate-fade-in-up">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-200">Error</h3>
						<p class="mt-1 text-sm text-red-300">{error}</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearResult} class="text-red-300 hover:text-red-200" aria-label="Clear error">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Not Found Message -->
		{#if notFound}
			<div class="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6 animate-fade-in-up">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-yellow-200">Code Not Found</h3>
						<p class="mt-1 text-sm text-yellow-300">The code "{code}" was not found in our system. Please check the code and try again.</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearResult} class="text-yellow-300 hover:text-yellow-200" aria-label="Clear result">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Result Display -->
		{#if result}
			<div class="bg-white shadow rounded-lg overflow-hidden">
				<div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
					<h2 class="text-lg font-semibold text-gray-900">Code Details</h2>
				</div>
				
				<div class="p-6 space-y-6">
					<!-- Code and Status -->
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-2xl font-bold text-gray-900 font-mono">{result.code}</h3>
							<p class="text-sm text-gray-500">Your tracking code</p>
						</div>
						<div class="text-right">
							{#if result.status === 'used'}
								<span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
									Used
								</span>
							{:else if result.status === 'registered'}
								<span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
									Registered
								</span>
							{:else}
								<span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
									{result.status}
								</span>
							{/if}
							<p class="text-sm text-gray-400 mt-1">Status</p>
						</div>
					</div>

					<!-- Mobile Number -->
					<div class="border-t border-gray-200 pt-6">
						<h4 class="text-sm font-medium text-gray-900 mb-2">Mobile Number</h4>
						<p class="text-lg text-gray-700">{formatMobileNumber(result.mobile)}</p>
					</div>

					<!-- Created Date -->
					<div class="border-t border-gray-200 pt-6">
						<h4 class="text-sm font-medium text-gray-900 mb-2">Generated</h4>
						<p class="text-lg text-gray-700">{new Date(result.created_at).toLocaleString()}</p>
					</div>

					<!-- Payload Information -->
					<div class="border-t border-gray-200 pt-6">
						<h4 class="text-sm font-medium text-gray-900 mb-2">Payload</h4>
						<div class="bg-gray-50 rounded-md p-4">
							<pre class="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify({
								code: result.code,
								mobile: result.mobile,
								status: result.status,
								payload: result.payload,
								created_at: result.created_at,
								updated_at: result.updated_at,
								tracked_at: new Date().toISOString()
							}, null, 2)}</pre>
						</div>
					</div>

					<!-- Actions -->
					<div class="border-t border-gray-200 pt-6">
						<button
							onclick={clearResult}
							class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
						>
							Track Another Code
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
