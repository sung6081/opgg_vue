<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <!-- 이미지 -->
    <img src="@/assets/poro.png" alt="Poro" class="mb-6 w-148 h-auto" />

    <div class="w-full max-w-2xl px-4">
      <div class="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden">
        <!-- 태그 입력 영역 (왼쪽) -->
        <div class="flex items-center w-1/2 border-r border-gray-300 px-4 py-4">
          <input
            v-model="tagText"
            type="text"
            placeholder="플레이어"
            class="w-full text-lg focus:outline-none"
          />
        </div>

        <!-- 플레이어 입력 영역 (오른쪽) -->
        <span class="text-gray-500 mr-2">#</span>
        <input
          v-model="searchText"
          type="text"
          placeholder="태그"
          class="w-1/2 py-4 text-lg focus:outline-none"
        />

        <!-- 검색 버튼 -->
        <button
          @click="handleSearch"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-full flex items-center justify-center"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 

const searchText = ref('')
const tagText = ref('')
const router = useRouter() 

const handleSearch = () => {
  if (!searchText.value || !tagText.value) {
    alert('플레이어와 태그를 모두 입력해주세요.')
    return
  }

  router.push({
    name: 'MatchDetail', 
    params: {
      gameName: tagText.value,
      tagLine: searchText.value
    }
  })
}
</script>
