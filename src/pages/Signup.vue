<script setup lang="ts">
import { ref } from 'vue';
import { signup, saveTokens } from '../api/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

function validate() {
  if (!username.value) return 'Username is required';
  if (username.value.length < 3) return 'Username must be at least 3 characters';
  if (!email.value) return 'Email is required';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) return 'Invalid email';
  if (!password.value) return 'Password is required';
  if (password.value.length < 6) return 'Password must be at least 6 characters';
  return '';
}

async function onSubmit(e: Event) {
  e.preventDefault();
  error.value = validate();
  if (error.value) return;
  loading.value = true;
  try {
    const res = await signup(username.value, email.value, password.value);
    saveTokens(res);
    error.value = '';
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Signup failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Sign Up</h2>
      <form class="space-y-6" @submit="onSubmit">
        <div>
          <label class="block text-gray-700 dark:text-gray-200 mb-2" for="username">Username</label>
          <input id="username" v-model="username" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white" required />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-200 mb-2" for="email">Email</label>
          <input id="email" v-model="email" type="email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white" required />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-200 mb-2" for="password">Password</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white pr-10" required />
            <button type="button" @click="showPassword = !showPassword" tabindex="-1" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none cursor-pointer">
              <span v-if="showPassword" aria-label="Hide password">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <span v-else aria-label="Show password">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </span>
            </button>
          </div>
        </div>
        <button :disabled="loading" type="submit" class="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 cursor-pointer">{{ loading ? 'Signing up...' : 'Sign Up' }}</button>
        <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
      </form>
      <div class="mt-6 text-center text-gray-600 dark:text-gray-300">
        Already have an account?
        <router-link to="/login" class="text-sky-600 hover:underline">Login</router-link>
      </div>
    </div>
  </div>
</template> 