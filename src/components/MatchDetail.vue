<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">전적 정보</h2>

    <!-- 카테고리 필터 버튼 -->
    <div class="flex justify-center gap-4 mb-6 flex-wrap">
      <button
        v-for="category in ['전체', ...categories]"
        :key="category"
        @click="setFilter(category)"
        class="px-4 py-2 rounded-full border"
        :class="{
          'bg-blue-500 text-white': currentFilter === category,
          'bg-white text-gray-800 hover:bg-gray-100': currentFilter !== category
        }"
      >
        {{ category }}
      </button>
    </div>

    <!-- 필터링된 전적 리스트 -->
    <div v-if="filteredMatches.length" class="space-y-6">
      <div
        v-for="(match, index) in filteredMatches"
        :key="index"
        class="overflow-x-auto border rounded-lg shadow-sm"
        :class="match.win ? 'bg-blue-50' : 'bg-red-50'"
      >
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3">챔피언</th>
              <th class="px-4 py-3">K/D/A</th>
              <th class="px-4 py-3">게임모드</th>
              <th class="px-4 py-3">결과</th>
              <th class="px-4 py-3">게임 시간</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-black hover:bg-gray-50 transition-all">
              <td class="px-4 py-2 flex items-center space-x-2">
                <img
                  :src="getChampionImage(match.championName)"
                  alt="champ"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span>{{ match.championName }}</span>
              </td>
              <td class="px-4 py-2">{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
              <td class="px-4 py-2">{{ match.gameMode }}</td>
              <td class="px-4 py-2 font-bold" :class="match.win ? 'text-blue-600' : 'text-red-600'">
                {{ match.win ? '승리' : '패배' }}
              </td>
              <td class="px-4 py-2">{{ (match.gameDuration / 60).toFixed(1) }}분</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 mt-10">전적 정보를 불러오는 중이거나 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const categorizedMatches = ref({})
const filteredMatches = ref([])
const categories = ref([])
const currentFilter = ref('전체')

function getChampionImage(name) {
  return require(`@/assets/img/champion/${name}.png`)
}

function setFilter(category) {
  currentFilter.value = category

  if (category === '전체') {
    // 모든 전적을 flat하게 펼쳐서 보여주기
    filteredMatches.value = Object.values(categorizedMatches.value)
      .flatMap(mode => [...(mode.win || []), ...(mode.lose || [])])
  } else {
    const resultMap = categorizedMatches.value[category]
    if (resultMap) {
      filteredMatches.value = [...(resultMap.win || []), ...(resultMap.lose || [])]
    } else {
      filteredMatches.value = []
    }
  }
}

onMounted(async () => {
  const { gameName, tagLine } = route.query

  try {
    const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRecentMatchesCategorized/${gameName}/${tagLine}`)
    categorizedMatches.value = res.data

    // 카테고리 목록 생성
    categories.value = Object.keys(res.data)

    // 처음에는 전체 전적 보여주기
    setFilter('전체')
  } catch (e) {
    console.error('전적 조회 실패:', e)
  }
})
</script>
