<template>
  <header
    class="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-6 z-50"
  >
    <!-- 로고 -->
    <div class="flex items-center">
      <img
        src="@/assets/SY.png"
        alt="Logo"
        class="h-12 w-auto cursor-pointer"
        @click="goToMain"
      />
    </div>

    <!-- 우측 로그인 버튼 -->
    <div>
      <button
        @click="goToLogin"
        class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
      >
        로그인
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToMain = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style>
