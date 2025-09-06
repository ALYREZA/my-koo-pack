<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { MobileEntry } from '$lib/types/auth.js';
	import { generateHumanReadableCode, validateMobileNumber, formatMobileNumber } from '$lib/utils/auth.js';
	import { addMobileEntry, getMobileEntries, markMobileEntryAsUsed } from '$lib/utils/supabase.js';

	let mobileNumber = $state('');
	let generatedCode = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let mobileEntries = $state<MobileEntry[]>([]);
	let isGenerating = $state(false);

	// Get platform data from the layout
	const platform = $page.data.platform;

	onMount(() => {
		loadMobileEntries();
	});

	async function loadMobileEntries() {
		isLoading = true;
		try {
			const { data, error: fetchError } = await getMobileEntries(platform);
			if (fetchError) {
				error = fetchError;
			} else {
				mobileEntries = data || [];
			}
		} catch (err) {
			console.error('Error loading mobile entries:', err);
			error = 'Failed to load mobile entries';
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
			const result = await addMobileEntry(mobileNumber, code, platform);
			
			if (result.success) {
				success = `Code ${code} generated successfully for ${formatMobileNumber(mobileNumber)}`;
				mobileNumber = '';
				// Reload entries to show the new one
				await loadMobileEntries();
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

	async function markAsUsed(entry: MobileEntry) {
		try {
			const result = await markMobileEntryAsUsed(entry.id, platform);
			if (result.success) {
				// Update local state
				mobileEntries = mobileEntries.map(e => 
					e.id === entry.id ? { ...e, used: true } : e
				);
			} else {
				error = result.error || 'Failed to mark as used';
			}
		} catch (err) {
			console.error('Error marking entry as used:', err);
			error = 'An error occurred while updating the entry';
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

<div class="space-y-6">
	<!-- Page Header -->
	<div class="bg-white shadow rounded-lg p-6">
		<h1 class="text-2xl font-bold text-gray-900 mb-2">Mobile Code Generator</h1>
		<p class="text-gray-600">Generate human-readable codes for mobile numbers and send them to Supabase.</p>
	</div>

	<!-- Code Generation Form -->
	<div class="bg-white shadow rounded-lg p-6">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Generate New Code</h2>
		
		<form onsubmit={(e) => { e.preventDefault(); generateCode(); }} class="space-y-4">
			<div>
				<label for="mobile" class="block text-sm font-medium text-gray-700 mb-2">
					Mobile Number
				</label>
				<input
					id="mobile"
					type="tel"
					placeholder="Enter mobile number (e.g., +1234567890 or 123-456-7890)"
					bind:value={mobileNumber}
					disabled={isGenerating}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>

			<button
				type="submit"
				disabled={isGenerating || !mobileNumber.trim()}
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
			<div class="mt-4 rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-800">{error}</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearMessages} class="text-red-400 hover:text-red-600" aria-label="Close error message">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if success}
			<div class="mt-4 rounded-md bg-green-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-green-800">{success}</p>
					</div>
					<div class="ml-auto pl-3">
						<button onclick={clearMessages} class="text-green-400 hover:text-green-600" aria-label="Close success message">
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
	<div class="bg-white shadow rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-lg font-semibold text-gray-900">Generated Codes</h2>
		</div>
		
		{#if isLoading}
			<div class="p-6 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-2 text-gray-600">Loading entries...</p>
			</div>
		{:else if mobileEntries.length === 0}
			<div class="p-6 text-center text-gray-500">
				<p>No mobile entries found. Generate your first code above.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Mobile Number
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Code
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each mobileEntries as entry}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{formatMobileNumber(entry.mobile)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
									{entry.code}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(entry.createdAt).toLocaleString()}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if entry.used}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
											Used
										</span>
									{:else}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											Active
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{#if !entry.used}
										<button
											onclick={() => markAsUsed(entry)}
											class="text-blue-600 hover:text-blue-900 font-medium"
										>
											Mark as Used
										</button>
									{:else}
										<span class="text-gray-400">-</span>
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
