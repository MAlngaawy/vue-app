<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>


    