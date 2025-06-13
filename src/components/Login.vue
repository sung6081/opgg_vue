<!-- Login.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>

      <!-- 이메일/비밀번호 로그인 폼 -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block mb-1">이메일</label>
          <input v-model="email" type="email" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-6">
          <label class="block mb-1">비밀번호</label>
          <input v-model="password" type="password" class="w-full border px-3 py-2 rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">로그인</button>
      </form>

      <!-- 회원가입 버튼 -->
      <button @click="goToSignup" class="w-full bg-gray-300 text-black py-2 rounded mt-2">회원가입</button>

      <!-- 카카오 로그인 버튼 -->
      <div class="mt-6 text-center">
        <KakaoLogin />
      </div>
    </div>
  </div>
</template>

<script>
import KakaoLogin from './KakaoLogin.vue'

export default {
  name: 'LoginPage',
  components: {
    KakaoLogin
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      // 이메일/비밀번호 로그인 로직
    },
    goToSignup() {
      this.$router.push('/signup')
    }
  }
}
</script>
