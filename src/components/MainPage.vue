<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <!-- 이미지 -->
    <img src="@/assets/poro.png" alt="Poro" class="mb-6 w-148 h-auto" />

    <div class="w-full max-w-2xl px-4">
      <div class="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden">
        <input
          v-model="searchText"
          type="text"
          placeholder="플레이어 검색"
          class="flex-grow px-6 py-4 text-lg focus:outline-none rounded-l-full"
        />
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
