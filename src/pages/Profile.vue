<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authFetch, getAccessToken } from '../api/auth';

const router = useRouter();
const loading = ref(true);
const error = ref('');
const user = ref<any>(null);

onMounted(async () => {
  if (!getAccessToken()) {
    router.replace('/login');
    return;
  }
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/profile`);
    if (!res.ok) throw await res.json();
    const data = await res.json();
    user.value = data.user;
    error.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to load profile';
    if (err.message && err.message.toLowerCase().includes('unauthorized')) {
      router.replace('/login');
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Profile</h2>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
      <div v-else-if="user">
        <div class="mb-4">
          <span class="font-semibold text-gray-700 dark:text-gray-200">Username:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{ user.username }}</span>
        </div>
        <div class="mb-4">
          <span class="font-semibold text-gray-700 dark:text-gray-200">Email:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{ user.email }}</span>
        </div>
        <div class="mb-4">
          <span class="font-semibold text-gray-700 dark:text-gray-200">Created At:</span>
          <span class="ml-2 text-gray-900 dark:text-white">{{ new Date(user.createdAt).toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 