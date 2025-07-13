<template>
  <!-- Show Feed when logged in -->
  <div v-if="isLoggedIn">
    <Feed />
  </div>
  
  <!-- Show Welcome page when not logged in -->
  <div v-else class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Background Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-sky-300/30 to-blue-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-blue-300/20 to-sky-400/15 transform rotate-45 blur-3xl"></div>
      <div class="absolute bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-sky-400/20 to-blue-300/15 transform rotate-12 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-72 h-72 bg-gradient-to-tl from-blue-300/15 to-sky-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-sky-400/40 rounded-full animate-pulse"></div>
      <div class="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute bottom-1/3 left-1/3 w-3 h-3 bg-sky-300/40 rounded-full animate-pulse delay-500"></div>
    </div>
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-6xl md:text-8xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-6 leading-tight">
          AskMe
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          The ultimate platform for anonymous and open conversations. Ask questions, share answers, and discover what others are curious about.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ask Anonymously</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Send questions without revealing your identity. Perfect for sensitive or curious questions.</p>
          </div>
          <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share Answers</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Answer questions from others and build meaningful connections through knowledge sharing.</p>
          </div>
          <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Discover Community</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Explore questions and answers from the community. Learn from others and share your insights.</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <router-link to="/login" class="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
            <span class="relative z-10">Login</span>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </router-link>
          <router-link to="/signup" class="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-400 cursor-pointer">
            <span class="relative z-10">Sign Up</span>
            <div class="absolute inset-0 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </router-link>
        </div>
        <div class="mt-16 text-gray-600 dark:text-gray-400 text-sm">
          <p>Join thousands of users asking and answering questions every day</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Feed from './Feed.vue';

const isLoggedIn = ref(!!localStorage.getItem('accessToken'));

function updateLoginState() {
  isLoggedIn.value = !!localStorage.getItem('accessToken');
}

// Listen for storage events (in case of multi-tab logout)
function handleStorageChange() {
  updateLoginState();
}

// Listen for custom auth state changes
function handleAuthStateChange() {
  updateLoginState();
}

onMounted(() => {
  updateLoginState();
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('auth-state-changed', handleAuthStateChange);
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
  window.removeEventListener('auth-state-changed', handleAuthStateChange);
});
</script> 