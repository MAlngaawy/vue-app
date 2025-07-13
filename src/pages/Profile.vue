<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authFetch, getAccessToken } from '../api/auth';
import { getUserQuestions, getAskedQuestions, answerQuestion, ignoreQuestion } from '../api/questions';

interface Question {
  _id: string;
  fromUser?: { username: string };
  toUser: { username: string };
  question: string;
  answer?: string;
  isAnonymous: boolean;
  status: 'pending' | 'answered' | 'ignored';
  createdAt: string;
  answeredAt?: string;
}

const router = useRouter();
const loading = ref(true);
const error = ref('');
const user = ref<any>(null);
const activeTab = ref<'received' | 'asked'>('received');
const receivedQuestions = ref<Question[]>([]);
const askedQuestions = ref<Question[]>([]);
const answeringQuestion = ref<string | null>(null);
const answerText = ref('');
const ignoringQuestion = ref<string | null>(null);

onMounted(async () => {
  if (!getAccessToken()) {
    router.replace('/login');
    return;
  }
  await loadUserProfile();
  await loadQuestions();
});

async function loadUserProfile() {
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
}

async function loadQuestions() {
  if (!user.value) return;
  
  try {
    const [receivedRes, askedRes] = await Promise.all([
      getUserQuestions(user.value._id),
      getAskedQuestions(user.value._id)
    ]);
    
    receivedQuestions.value = receivedRes.questions || [];
    askedQuestions.value = askedRes.questions || [];
  } catch (err: any) {
    console.error('Failed to load questions:', err);
  }
}

async function handleAnswer(questionId: string) {
  if (!answerText.value.trim()) return;
  
  answeringQuestion.value = questionId;
  try {
    await answerQuestion(questionId, answerText.value.trim());
    answerText.value = '';
    await loadQuestions(); // Reload to get updated data
  } catch (err: any) {
    error.value = err.message || 'Failed to answer question';
  } finally {
    answeringQuestion.value = null;
  }
}

async function handleIgnore(questionId: string) {
  ignoringQuestion.value = questionId;
  try {
    await ignoreQuestion(questionId);
    await loadQuestions(); // Reload to get updated data
  } catch (err: any) {
    error.value = err.message || 'Failed to ignore question';
  } finally {
    ignoringQuestion.value = null;
  }
}

function startAnswer(questionId: string) {
  answeringQuestion.value = questionId;
  answerText.value = '';
}

function cancelAnswer() {
  answeringQuestion.value = null;
  answerText.value = '';
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- User Info -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div class="text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ user?.username }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ user?.email }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Member since {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '' }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            @click="activeTab = 'received'"
            :class="[
              'flex-1 py-4 px-6 text-center font-semibold transition-colors cursor-pointer',
              activeTab === 'received' 
                ? 'text-sky-600 border-b-2 border-sky-600 dark:text-sky-400 dark:border-sky-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            Received Questions ({{ receivedQuestions.length }})
          </button>
          <button 
            @click="activeTab = 'asked'"
            :class="[
              'flex-1 py-4 px-6 text-center font-semibold transition-colors cursor-pointer',
              activeTab === 'asked' 
                ? 'text-sky-600 border-b-2 border-sky-600 dark:text-sky-400 dark:border-sky-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            Asked Questions ({{ askedQuestions.length }})
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Received Questions Tab -->
          <div v-if="activeTab === 'received'">
            <div v-if="receivedQuestions.length === 0" class="text-center text-gray-500 py-8">
              No questions received yet.
            </div>
            <div v-else class="space-y-6">
              <div 
                v-for="question in receivedQuestions" 
                :key="question._id"
                :class="[
                  'rounded-lg p-6 border',
                  question.isAnonymous
                    ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                ]"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-center mb-1">
                      <span v-if="question.isAnonymous" class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a8 8 0 00-8 8v1a8 8 0 0016 0v-1a8 8 0 00-8-8zm0 0v2m0 8h.01"></path>
                        </svg>
                        <span class="text-yellow-700 dark:text-yellow-300 font-semibold bg-yellow-100 dark:bg-yellow-800/60 px-2 py-0.5 rounded mr-2">Anonymous</span>
                        <span class="text-gray-400 dark:text-gray-500">asked you</span>
                      </span>
                      <span v-else class="text-gray-500 dark:text-gray-400">
                        From: {{ question.fromUser?.username || 'Unknown' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ new Date(question.createdAt).toLocaleDateString() }}
                    </p>
                  </div>
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      question.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      question.status === 'answered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ question.status }}
                  </span>
                </div>
                
                <div class="mb-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Question:</h3>
                  <p :class="question.isAnonymous ? 'italic text-gray-800 dark:text-yellow-100' : 'text-gray-700 dark:text-gray-300'">{{ question.question }}</p>
                </div>

                <div v-if="question.answer" class="mb-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Your Answer:</h3>
                  <p class="text-gray-700 dark:text-gray-300">{{ question.answer }}</p>
                </div>

                <div v-if="question.status === 'pending'" class="flex space-x-3">
                  <button 
                    @click="startAnswer(question._id)"
                    class="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Answer
                  </button>
                  <button 
                    @click="handleIgnore(question._id)"
                    :disabled="ignoringQuestion === question._id"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {{ ignoringQuestion === question._id ? 'Ignoring...' : 'Ignore' }}
                  </button>
                </div>

                <!-- Answer Form -->
                <div v-if="answeringQuestion === question._id" class="mt-4">
                  <textarea 
                    v-model="answerText"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white"
                    rows="3"
                    placeholder="Type your answer..."
                  ></textarea>
                  <div class="flex space-x-3 mt-3">
                    <button 
                      @click="handleAnswer(question._id)"
                      :disabled="!answerText.trim()"
                      class="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-60 cursor-pointer"
                    >
                      Submit Answer
                    </button>
                    <button 
                      @click="cancelAnswer"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Asked Questions Tab -->
          <div v-if="activeTab === 'asked'">
            <div v-if="askedQuestions.length === 0" class="text-center text-gray-500 py-8">
              You haven't asked any questions yet.
            </div>
            <div v-else class="space-y-6">
              <div 
                v-for="question in askedQuestions" 
                :key="question._id"
                :class="[
                  'rounded-lg p-6 border',
                  question.isAnonymous
                    ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                ]"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-center mb-1">
                      <span v-if="question.isAnonymous" class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a8 8 0 00-8 8v1a8 8 0 0016 0v-1a8 8 0 00-8-8zm0 0v2m0 8h.01"></path>
                        </svg>
                        <span class="text-yellow-700 dark:text-yellow-300 font-semibold bg-yellow-100 dark:bg-yellow-800/60 px-2 py-0.5 rounded mr-2">Anonymous</span>
                        <span class="text-gray-400 dark:text-gray-500">(you asked anonymously)</span>
                      </span>
                      <span v-else class="text-gray-500 dark:text-gray-400">
                        To: {{ question.toUser?.username || 'Unknown' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ new Date(question.createdAt).toLocaleDateString() }}
                    </p>
                  </div>
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      question.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      question.status === 'answered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ question.status }}
                  </span>
                </div>
                
                <div class="mb-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Your Question:</h3>
                  <p :class="question.isAnonymous ? 'italic text-gray-800 dark:text-yellow-100' : 'text-gray-700 dark:text-gray-300'">{{ question.question }}</p>
                </div>

                <div v-if="question.answer" class="mb-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Answer:</h3>
                  <p class="text-gray-700 dark:text-gray-300">{{ question.answer }}</p>
                </div>

                <div v-if="question.status === 'ignored'" class="text-red-500 text-sm">
                  This question was ignored.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 