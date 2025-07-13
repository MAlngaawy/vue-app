import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Signup from './pages/Signup.vue';
import Profile from './pages/Profile.vue';
import Users from './pages/Users.vue';
import Feed from './pages/Feed.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/users', name: 'Users', component: Users },
  { path: '/feed', name: 'Feed', component: Feed },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for private route
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  if ((to.name === 'Profile' || to.name === 'Feed') && !isAuthenticated) {
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Signup') && isAuthenticated) {
    next('/profile');
  } else {
    next();
  }
});

export default router; 