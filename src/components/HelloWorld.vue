<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">{{ msg }}</h1>

    <div class="text-center mb-8">
      <button 
        type="button" 
        @click="count++"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
      >
        count is {{ count }}
      </button>
      <p class="text-gray-600 dark:text-gray-300">
        Edit
        <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <div class="space-y-4 text-center">
      <p class="text-gray-600 dark:text-gray-300">
        Check out
        <a 
          href="https://vuejs.org/guide/quick-start.html#local" 
          target="_blank"
          class="text-blue-500 hover:text-blue-600 underline"
        >
          create-vue
        </a
        >, the official Vue + Vite starter
      </p>
      <p class="text-gray-600 dark:text-gray-300">
        Learn more about IDE Support for Vue in the
        <a
          href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
          target="_blank"
          class="text-blue-500 hover:text-blue-600 underline"
        >
          Vue Docs Scaling up Guide
        </a
        >.
      </p>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Click on the Vite and Vue logos to learn more</p>
    </div>
  </div>
</template>


