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

    <!-- 중앙 카테고리 -->
    <nav class="flex-1 flex justify-center">
      <button
        @click="goToChampion"
        class="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-200"
      >
        챔피언 정보
      </button>
    </nav>

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

const goToChampion = () => {
  router.push('/champions') // 챔피언 분석 페이지 경로에 맞게 수정
}
</script>
