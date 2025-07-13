<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Login</h2>
      <form class="space-y-6">
        <div>
          <label class="block text-gray-700 dark:text-gray-200 mb-2" for="email">Email</label>
          <input id="email" type="email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white" required />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-200 mb-2" for="password">Password</label>
          <input id="password" type="password" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-gray-900 dark:text-white" required />
        </div>
        <button type="submit" class="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">Login</button>
      </form>
      <div class="mt-6 text-center text-gray-600 dark:text-gray-300">
        Don't have an account?
        <router-link to="/signup" class="text-sky-600 hover:underline">Sign Up</router-link>
      </div>
    </div>
  </div>
</template> 