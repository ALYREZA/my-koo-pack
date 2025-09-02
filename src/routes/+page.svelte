<script lang="ts">
  // Profile data
  let profile = $state({
    name: "Koo Pack",
    bio: "Professional packaging solutions for your business needs",
    avatar: "/api/placeholder/150/150",
    links: [
      {
        title: "Instagram",
        url: "https://instagram.com/koo_pack",
        icon: "📸",
        color: "from-purple-500 to-pink-500"
      },
      {
        title: "Email",
        url: "mailto:info@koopack.com",
        icon: "📧",
        color: "from-blue-500 to-cyan-500"
      },
      {
        title: "Phone",
        url: "tel:+1234567890",
        icon: "📞",
        color: "from-green-500 to-emerald-500"
      },
      {
        title: "Website",
        url: "#",
        icon: "🌐",
        color: "from-indigo-500 to-purple-500"
      }
    ]
  });

  // Animation states
  let hoveredIndex = $state<number | null>(null);
</script>

<svelte:head>
  <title>{profile.name} - Contact & Links</title>
  <meta name="description" content="Get in touch with {profile.name} - Professional packaging solutions" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float" style="animation-delay: -3s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pulse-slow"></div>
  </div>
  
  <div class="w-full max-w-md mx-auto relative z-10">
    <!-- Profile Section -->
    <div class="text-center mb-8 animate-fade-in-up">
      <!-- Avatar -->
      <div class="relative mb-6">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1 transition-smooth hover:scale-110">
          <div class="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-white">
            KP
          </div>
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 pulse-slow"></div>
      </div>
      
      <!-- Name -->
      <h1 class="text-2xl sm:text-3xl font-bold gradient-text mb-2">{profile.name}</h1>
      
      <!-- Bio -->
      <p class="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
        {profile.bio}
      </p>
    </div>

    <!-- Links Section -->
    <div class="space-y-4">
      {#each profile.links as link, index}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="block group animate-fade-in-up"
          style="animation-delay: {index * 0.1}s;"
          on:mouseenter={() => hoveredIndex = index}
          on:mouseleave={() => hoveredIndex = null}
        >
          <div class="relative overflow-hidden rounded-xl glass p-4 sm:p-5 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-bounce">
            <!-- Background gradient animation -->
            <div class="absolute inset-0 bg-gradient-to-r {link.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <!-- Shimmer effect on hover -->
            <div class="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Content -->
            <div class="relative flex items-center space-x-3 sm:space-x-4">
              <div class="text-2xl sm:text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                {link.icon}
              </div>
              <span class="text-white font-medium text-lg sm:text-xl flex-1">{link.title}</span>
              
              <!-- Arrow icon -->
              <div class="transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Hover effect line -->
            <div class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r {link.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            
            <!-- Corner accent -->
            <div class="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </a>
      {/each}
    </div>

    <!-- Footer -->
    <div class="text-center mt-12 animate-fade-in-up" style="animation-delay: 0.6s;">
      <div class="mt-4 flex justify-center space-x-4">
        <div class="w-2 h-2 bg-purple-400 rounded-full pulse-slow"></div>
        <div class="w-2 h-2 bg-pink-400 rounded-full pulse-slow" style="animation-delay: -1s;"></div>
        <div class="w-2 h-2 bg-cyan-400 rounded-full pulse-slow" style="animation-delay: -2s;"></div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
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
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
</style>
