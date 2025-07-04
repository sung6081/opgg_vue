<!-- RankInfo.vue -->
<template>
  <div class="bg-gray-800 p-4 rounded-xl w-64 text-white space-y-6">
    <h2 class="text-2xl font-bold mb-6 text-center">랭크 정보</h2>
    
    <!-- 개인/2인 랭크 -->
    <div>
        <h3 class="text-sm font-semibold text-gray-300 mb-2">개인/2인 랭크 게임</h3>
        <div class="bg-gray-900 rounded-lg p-4">
            <template v-if="tier && rank !== null">
                <div class="flex items-center space-x-3">
                    <img :src="tierImage" id="rankImage" :alt="tier" class="w-12 h-12" />
                    <div>
                    <div class="text-lg font-bold">{{ tier }} {{ rank }}</div>
                    <div class="text-sm text-gray-400">{{ leaguePoints }} LP</div>
                    </div>
                </div>
                <div class="text-sm text-gray-400 mt-2">
                    {{ wins }}승 {{ losses }}패 (승률 {{ puccent }}%)
                </div>
                </template>
                <template v-else>
                <div class="text-center text-gray-400 text-sm">
                    Unranked
                </div>
            </template>
        </div>
    </div>

    <!-- 자유 랭크 -->
    <div>
      <h3 class="text-sm font-semibold text-gray-300 mb-2">자유 랭크 게임</h3>
      <div class="bg-gray-900 rounded-lg p-4">
        <template v-if="flexTier && flexRank !== null">
        <div class="flex items-center space-x-3">
          <img :src="flexTierImage" id="flexRankImage" :alt="flexTier" class="w-12 h-12" />
          <div>
            <div class="text-lg font-bold">{{ flexTier }} {{ flexRank }}</div>
            <div class="text-sm text-gray-400">{{ flexLeaguPoints }} LP</div>
          </div>
        </div>
        <div class="text-sm text-gray-400 mt-2">{{ flexWins }}승 {{ flexLosses }}패 (승률 {{ flexPuccent }}%)</div>
        </template>
        <template v-else>
            <div class="text-center text-gray-400 text-sm">
                Unranked
            </div>
        </template>
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

    const rank = ref(null);
    const tier = ref(null);
    const tierImage = ref('');
    const leaguePoints = ref('');
    const wins = ref('');
    const losses = ref('');
    const puccent = ref('');

    const flexRank = ref(null);
    const flexTier = ref(null);
    const flexTierImage = ref('');
    const flexLeaguPoints = ref('');
    const flexWins = ref('');
    const flexLosses = ref('');
    const flexPuccent = ref('');

    onMounted(async () => {
    const { gameName, tagLine } = route.query;
    console.log("랭크 검색 : "+gameName+"#"+tagLine);
    try {
        const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRankByGameName/${gameName}/${tagLine}`)
        console.log(res);
        ranks.value = res.data;
        const rankQue = ranks.value.find(r => r.queueType === 'RANKED_SOLO_5x5');
        const flexRankQue = ranks.value.find(r => r.queueType === 'RANKED_FLEX_SR');

        const tierMap = {
            'IRON': 'Iron',
            BRONZE: 'Bronze',
            SILVER: 'Silver',
            GOLD: 'Gold',
            PLATINUM: 'Platinum',
            EMERALD: 'Emerald',
            DIAMOND: 'Diamond',
            MASTER: 'Master',
            GRANDMASTER: 'Grandmaster',
            CHALLENGER: 'Challenger'
        };

        if (rankQue != null && rankQue != undefined) {
            tier.value = tierMap[rankQue.tier] || '';

            if(tier.value){
                tierImage.value = require('@/assets/img/tft-regalia/TFT_Regalia_'+tier.value+'.png');
            }

            rank.value = rankQue.rank;
            leaguePoints.value = rankQue.leaguePoints;
            wins.value = rankQue.wins;
            losses.value = rankQue.losses;
            puccent.value = Math.floor(wins.value / (wins.value + losses.value) * 100);

            if(tier.value == 'Challenger' || tier.value == 'GrandMaster' || tier.value == 'Master') {
                rank.value = '';
            }
        }else {
            console.log('No rank info');
        }
        if (flexRankQue != null && flexRankQue != undefined) {
            flexTier.value = tierMap[flexRankQue.tier] || '';

            if(flexTier.value){
                flexTierImage.value = require('@/assets/img/tft-regalia/TFT_Regalia_'+flexTier.value+'.png');
            }

            flexRank.value = flexRankQue.rank;
            flexLeaguPoints.value = flexRankQue.leaguePoints;
            flexWins.value = flexRankQue.wins;
            flexLosses.value = flexRankQue.losses;
            flexPuccent.value = Math.floor(flexWins.value / (flexWins.value + flexLosses.value) * 100);

            if(flexTier.value == 'Challenger' || flexTier.value == 'GrandMaster' || flexTier.value == 'Master') {
                flexRank.value = '';
            }
        }else {
            console.log('No flex rank info');
        }
        
    } catch (e) {
        console.error('전적 조회 실패:', e)
    }
    });

</script>