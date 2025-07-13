<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4">
          Community Feed
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover what people are asking and answering in our community
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <div class="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Oops!</div>
          <div class="text-red-500 dark:text-red-300 mb-4">{{ error }}</div>
          <button 
            @click="loadFeed" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="questions.length === 0" class="text-center py-12">
        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-md mx-auto">
          <div class="text-gray-400 dark:text-gray-500 text-6xl mb-4">🤔</div>
          <div class="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">No questions yet</div>
          <div class="text-gray-500 dark:text-gray-400 mb-4">Be the first to ask a question!</div>
          <router-link 
            to="/users" 
            class="inline-block px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
          >
            Ask a Question
          </router-link>
        </div>
      </div>

      <!-- Feed Content -->
      <div v-else class="max-w-4xl mx-auto space-y-6">
        <div 
          v-for="question in questions" 
          :key="question._id" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <!-- Question Header -->
          <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ question.toUser?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ question.toUser?.username || 'Unknown User' }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(question.answeredAt) }}
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500">
                Answered
              </div>
            </div>
            
            <!-- Question -->
            <div
              :class="[
                'rounded-lg p-4 mb-4',
                question.isAnonymous
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500'
                  : 'bg-gray-50 dark:bg-gray-700'
              ]"
            >
              <div class="flex items-center mb-2">
                <span v-if="question.isAnonymous" class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a8 8 0 00-8 8v1a8 8 0 0016 0v-1a8 8 0 00-8-8zm0 0v2m0 8h.01"></path>
                  </svg>
                  <span class="text-yellow-700 dark:text-yellow-300 font-semibold bg-yellow-100 dark:bg-yellow-800/60 px-2 py-0.5 rounded mr-2">Anonymous</span>
                  <span class="text-gray-400 dark:text-gray-500">asked:</span>
                </span>
                <span v-else-if="question.fromUser" class="text-gray-400 dark:text-gray-500">
                  {{ question.fromUser.username }} asked:
                </span>
                <span v-else class="text-gray-400 dark:text-gray-500">
                  Someone asked:
                </span>
              </div>
              <div :class="question.isAnonymous ? 'italic text-gray-800 dark:text-yellow-100' : 'text-gray-900 dark:text-white font-medium'">
                {{ question.question }}
              </div>
            </div>

            <!-- Answer -->
            <div class="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg p-4">
              <div class="text-sm text-sky-600 dark:text-sky-400 font-medium mb-2">
                Answer:
              </div>
              <div class="text-gray-900 dark:text-white">
                {{ question.answer }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button 
                  @click="likeQuestion(question._id)"
                  class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span class="text-sm">Like</span>
                </button>
                <button 
                  @click="askSimilarQuestion(question.toUser?._id)"
                  class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span class="text-sm">Ask Similar</span>
                </button>
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatTimeAgo(question.answeredAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="questions.length >= 50" class="text-center py-8">
          <button 
            @click="loadMore"
            class="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFeedQuestions } from '../api/questions';

const router = useRouter();

interface User {
  _id: string;
  username: string;
}

interface Question {
  _id: string;
  fromUser?: User;
  toUser?: User;
  question: string;
  answer: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
  answeredAt: string;
}

const questions = ref<Question[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const loadFeed = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await getFeedQuestions();
    questions.value = response.questions;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load feed';
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  // TODO: Implement pagination
  console.log('Load more functionality to be implemented');
};

const likeQuestion = (questionId: string) => {
  // TODO: Implement like functionality
  console.log('Like question:', questionId);
};

const askSimilarQuestion = (userId?: string) => {
  if (userId) {
    // Navigate to users page with pre-selected user
    router.push(`/users?userId=${userId}`);
  } else {
    router.push('/users');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

onMounted(() => {
  loadFeed();
});
</script> 