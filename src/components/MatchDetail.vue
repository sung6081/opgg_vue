<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">전적 정보</h2>

    <div v-if="matches.length" class="space-y-6">
      <div
        v-for="(match, index) in matches"
        :key="index"
        class="overflow-x-auto border rounded-lg shadow-md"
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// 라우트로부터 게임명/태그 가져오기
const route = useRoute()
const matches = ref([])

// 이미지 경로 매핑 함수 (Webpack 전용 방식)
function getChampionImage(name) {
  return require(`@/assets/img/champion/${name}.png`)
}

// 마운트 시 API 호출
onMounted(async () => {
  const { gameName, tagLine } = route.query
  console.log("전적 검색 : " + gameName + "#" + tagLine)

  try {
    const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRecentMatches/${gameName}/${tagLine}`)
    matches.value = res.data
  } catch (e) {
    console.error('전적 조회 실패:', e)
  }
})
</script>
