<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../api/auth';

const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem('accessToken'));

function updateLoginState() {
  isLoggedIn.value = !!localStorage.getItem('accessToken');
}

async function handleLogout() {
  await logout();
  updateLoginState();
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('auth-state-changed'));
  // Small delay to ensure state updates are processed
  setTimeout(() => {
    router.push('/');
  }, 100);
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

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            AskMe
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer">
            Home
          </router-link>
          <router-link v-if="isLoggedIn" to="/feed" class="text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer">
            Feed
          </router-link>
          <router-link v-if="isLoggedIn" to="/users" class="text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer">
            Users
          </router-link>
          <router-link v-if="isLoggedIn" to="/profile" class="text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer">
            Profile
          </router-link>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="px-4 py-2 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors duration-200 cursor-pointer">
              Login
            </router-link>
            <router-link to="/signup" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer">
              Sign Up
            </router-link>
          </template>
          <template v-else>
            <button @click="handleLogout" class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer">
              Log Out
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template> 