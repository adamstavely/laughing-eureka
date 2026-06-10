import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/browse', name: 'browse', component: () => import('@/views/BrowseView.vue') },
    { path: '/standards/:id', name: 'standard', component: () => import('@/views/StandardDetailView.vue') },
    { path: '/enablers', name: 'enablers', component: () => import('@/views/EnablersView.vue') },
    { path: '/enablers/:id', name: 'enabler', component: () => import('@/views/EnablerDetailView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
