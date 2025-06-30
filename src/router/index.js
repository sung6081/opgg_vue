// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/Login.vue'
import MainPage from '@/components/MainPage.vue'
import SignupPage from '@/components/SignupPage.vue'
import GoogleRedirect from '@/components/GoogleLoginRedirect.vue'
import SearchResult from '@/components/SearchResult.vue'
import NotFound from '@/components/NotFound.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/redirect', component: GoogleRedirect },
  { path: '/search', component: SearchResult },
  { path: '/notfound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
