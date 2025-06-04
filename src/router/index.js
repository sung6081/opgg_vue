// src/router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import SignupPage from '@/views/SignupPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signup',
      name: 'Signup',
      component: SignupPage,
    },
    // 필요 시 다른 경로도 추가 가능
  ],
})
