<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Request } from '$lib/types/auth.js';
	import { generateHumanReadableCode, validateMobileNumber, formatMobileNumber } from '$lib/utils/auth.js';
	import { addRequest, getRequests, updateRequestStatus } from '$lib/utils/supabase.js';

	let mobileNumber = $state('');
	let generatedCode = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let requests = $state<Request[]>([]);
	let isGenerating = $state(false);

	// Get platform data from the layout
	const platform = $page.data.platform;

	onMount(() => {
		loadRequests();
	});

	async function loadRequests() {
		isLoading = true;
		try {
			const { data, error: fetchError } = await getRequests(platform);
			if (fetchError) {
				error = fetchError;
			} else {
				requests = data || [];
			}
		} catch (err) {
			console.error('Error loading requests:', err);
			error = 'Failed to load requests';
		} finally {
			isLoading = false;
		}
	}

	async function generateCode() {
		if (!mobileNumber.trim()) {
			error = 'Please enter a mobile number';
			return;
		}

		if (!validateMobileNumber(mobileNumber)) {
			error = 'Please enter a valid mobile number';
			return;
		}

		isGenerating = true;
		error = '';
		success = '';

		try {
			// Generate human-readable code
			const code = generateHumanReadableCode();
			generatedCode = code;

			// Add to Supabase
			const result = await addRequest(mobileNumber, code, platform);
			
			if (result.success) {
				success = `Code ${code} generated successfully for ${formatMobileNumber(mobileNumber)}`;
				mobileNumber = '';
				// Reload requests to show the new one
				await loadRequests();
			} else {
				error = result.error || 'Failed to generate code';
			}
		} catch (err) {
			console.error('Error generating code:', err);
			error = 'An error occurred while generating the code';
		} finally {
			isGenerating = false;
		}
	}

	async function markAsUsed(request: Request) {
		try {
			const result = await updateRequestStatus(request.id, 'used', platform);
			if (result.success) {
				// Update local state
				requests = requests.map(r => 
					r.id === request.id ? { ...r, status: 'used', updated_at: new Date().toISOString() } : r
				);
			} else {
				error = result.error || 'Failed to mark as used';
			}
		} catch (err) {
			console.error('Error marking request as used:', err);
			error = 'An error occurred while updating the request';
		}
	}

	function clearMessages() {
		error = '';
		success = '';
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Koo Pack</title>
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

<div class="space-y-6">
	<!-- Page Header -->
	<div class="glass rounded-xl p-6 animate-fade-in-up">
		<h1 class="text-2xl font-bold text-white gradient-text mb-2">Mobile Code Generator</h1>
		<p class="text-gray-300">Generate human-readable codes for mobile numbers and send them to Supabase.</p>
	</div>

	<!-- Code Generation Form -->
	<div class="glass rounded-xl p-6 animate-fade-in-up" style="animation-delay: 0.2s;">
		<h2 class="text-lg font-semibold text-white mb-4">Generate New Code</h2>
		
		<form onsubmit={(e) => { e.preventDefault(); generateCode(); }} class="space-y-4">
			<div>
				<label for="mobile" class="block text-sm font-medium text-gray-300 mb-2">
					Mobile Number
				</label>
				<input
					id="mobile"
					type="tel"
					placeholder="Enter mobile number (e.g., +1234567890 or 123-456-7890)"
					bind:value={mobileNumber}
					disabled={isGenerating}
					class="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
				/>
			</div>

			<button
				type="submit"
				disabled={isGenerating || !mobileNumber.trim()}
				class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
			>
				{#if isGenerating}
					<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Generating...
				{:else}
					Generate Code
				{/if}
			</button>
		</form>

		<!-- Messages -->
		{#if error}
			<div class="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-200">{error}</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearMessages} class="text-red-300 hover:text-red-200" aria-label="Close error message">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if success}
			<div class="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-green-200">{success}</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearMessages} class="text-green-300 hover:text-green-200" aria-label="Close success message">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Mobile Entries List -->
	<div class="glass rounded-xl overflow-hidden animate-fade-in-up" style="animation-delay: 0.4s;">
		<div class="px-6 py-4 border-b border-white/20">
			<h2 class="text-lg font-semibold text-white">Generated Codes</h2>
		</div>
		
		{#if isLoading}
			<div class="p-6 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
				<p class="mt-2 text-gray-300">Loading requests...</p>
			</div>
		{:else if requests.length === 0}
			<div class="p-6 text-center text-gray-400">
				<p>No requests found. Generate your first code above.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-white/20">
					<thead class="bg-white/5">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Mobile Number
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Code
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Created
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/20">
						{#each requests as request}
							<tr class="hover:bg-white/5 transition-colors duration-200">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
									{formatMobileNumber(request.mobile)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
									{request.code}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{new Date(request.created_at).toLocaleString()}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if request.status === 'used'}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
											Used
										</span>
									{:else if request.status === 'registered'}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
											Registered
										</span>
									{:else}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
											{request.status}
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{#if request.status === 'registered'}
										<button
											onclick={() => markAsUsed(request)}
											class="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
										>
											Mark as Used
										</button>
									{:else}
										<span class="text-gray-500">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
