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
              <th class="px-4 py-3">#{{ index + 1 }}</th>
              <th class="px-4 py-3">챔피언</th>
              <th class="px-4 py-3">K/D/A</th>
              <th class="px-4 py-3">게임모드</th>
              <th class="px-4 py-3">결과</th>
              <th class="px-4 py-3">게임 시간</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white hover:bg-gray-50 transition-all">
              <td class="px-4 py-2 font-semibold">Match {{ index + 1 }}</td>
              <td class="px-4 py-2">{{ match.championName }}</td>
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

const route = useRoute()
const matches = ref([])

onMounted(async () => {
  const { gameName, tagLine } = route.query;
  console.log("전적 검색 : "+gameName+"#"+tagLine);
  try {
    const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRecentMatches/${gameName}/${tagLine}`)
    console.log(res);
    matches.value = res.data
  } catch (e) {
    console.error('전적 조회 실패:', e)
  }
})
</script>
