<!-- RankInfo.vue -->
<template>
  <div class="bg-gray-800 p-4 rounded-xl w-64 text-white space-y-6">
    <h2 class="text-2xl font-bold mb-6 text-center">랭크 정보</h2>
    <!-- 개인/2인 랭크 -->
    <div>
      <h3 class="text-sm font-semibold text-gray-300 mb-2">개인/2인 랭크 게임</h3>
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <img :src="rankImage" id="rankImage" alt="Gold" class="w-12 h-12" />
          <div>
            <div class="text-lg font-bold">Gold 4</div>
            <div class="text-sm text-gray-400">57 LP</div>
          </div>
        </div>
        <div class="text-sm text-gray-400 mt-2">58승 45패 (승률 56%)</div>
      </div>
    </div>

    <!-- 자유 랭크 -->
    <div>
      <h3 class="text-sm font-semibold text-gray-300 mb-2">자유 랭크 게임</h3>
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <img :src="flexRankImage" id="flexRankImage" alt="Bronze" class="w-12 h-12" />
          <div>
            <div class="text-lg font-bold">Bronze 2</div>
            <div class="text-sm text-gray-400">35 LP</div>
          </div>
        </div>
        <div class="text-sm text-gray-400 mt-2">4승 2패 (승률 67%)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
    // 추후 props로 tier 정보 받아 처리 예정
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    const route = useRoute();
    const ranks = ref([]);
    let rankImage = ref('');
    let flexRankImage = ref('');

    onMounted(async () => {
    const { gameName, tagLine } = route.query;
    console.log("랭크 검색 : "+gameName+"#"+tagLine);
    try {
        const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRankByGameName/${gameName}/${tagLine}`)
        console.log(res);
        ranks.value = res.data;
        
        const rank = ranks.value.find(r => r.queueType === 'RANKED_SOLO_5x5');
        const flexRank = ranks.value.find(r => r.queueType === 'RANKED_FLEX_SR');

        if (rank) {
            const rankTier = rank.tier.charAt(0).toUpperCase() + rank.tier.slice(1).toLowerCase();
            rankImage.value = '../assets/img/tft-regalia/TFT_Regalia_'+rankTier+'.png';
        }
        if (flexRank) {
            const flexRankTier = flexRank.tier.charAt(0).toUpperCase() + flexRank.tier.slice(1).toLowerCase();
            flexRankImage.value = '../assets/img/tft-regalia/TFT_Regalia_'+flexRankTier+'.png';
        }
        
    } catch (e) {
        console.error('전적 조회 실패:', e)
    }
    });

</script>