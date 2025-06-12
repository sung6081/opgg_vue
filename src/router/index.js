// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/Login.vue'
import MainPage from '@/components/MainPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/login', component: LoginPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
