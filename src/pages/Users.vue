<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllUsers, sendQuestion } from '../api/questions';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref('');
const selectedUser = ref<User | null>(null);
const showQuestionModal = ref(false);
const question = ref('');
const isAnonymous = ref(false);
const sending = ref(false);

onMounted(async () => {
  try {
    const response = await getAllUsers();
    users.value = response.users || response;
    error.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to load users';
  } finally {
    loading.value = false;
  }
});

function openQuestionModal(user: User) {
  selectedUser.value = user;
  showQuestionModal.value = true;
  question.value = '';
  isAnonymous.value = false;
}

async function submitQuestion() {
  if (!selectedUser.value || !question.value.trim()) return;
  
  sending.value = true;
  try {
    await sendQuestion(selectedUser.value._id, question.value.trim(), isAnonymous.value);
    showQuestionModal.value = false;
    question.value = '';
    // You could show a success message here
  } catch (err: any) {
    error.value = err.message || 'Failed to send question';
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
        Ask Questions
      </h1>
      
      <div v-if="loading" class="text-center text-gray-500">Loading users...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="user in users" 
          :key="user._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="openQuestionModal(user)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ user.username }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Member since {{ new Date(user.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
          <button class="mt-4 w-full py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
            Ask Question
          </button>
        </div>
      </div>
    </div>

    <!-- Question Modal -->
    <div v-if="showQuestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Ask {{ selectedUser?.username }}
        </h2>
        
        <form @submit.prevent="submitQuestion" class="space-y-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-2">Question</label>
            <textarea 
              v-model="question"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white"
              rows="4"
              placeholder="Type your question here..."
              required
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input 
              id="anonymous" 
              v-model="isAnonymous" 
              type="checkbox" 
              class="mr-2"
            >
            <label for="anonymous" class="text-gray-700 dark:text-gray-200">Ask anonymously</label>
          </div>
          
          <div class="flex space-x-3">
            <button 
              type="button" 
              @click="showQuestionModal = false"
              class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="sending || !question.trim()"
              class="flex-1 py-2 px-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {{ sending ? 'Sending...' : 'Send Question' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 