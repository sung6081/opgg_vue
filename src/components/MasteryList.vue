<template>
  <div class="p-6 max-w-6xl mx-auto text-white">

    <h2 class="text-2xl font-bold mb-6 text-center">숙력도 정보</h2>

    <div class="flex justify-between items-end flex-wrap gap-6">
      <div
        v-for="(champ, index) in masteries.slice(0, 9)"
        :key="index"
        class="w-24 text-center"
      >
        <!-- 챔피언 이미지 -->
        <img
          :src="getChampionImage(champ.champion.image)"
          alt="champ"
          class="w-20 h-20 rounded-md mx-auto"
        />

        <!-- 숙련도 레벨 뱃지 -->
        <div class="relative w-8 h-8 mx-auto -mt-3">
          <img
            :src="getMasteryEmblem(champ.championLevel)"
            alt="mastery"
            class="w-full h-full"
          />
        </div>
        <div>
            {{ champ.championLevel }}
        </div>

        <!-- 챔피언 이름 (한글) -->
        <div class="mt-1 text-sm font-semibold">
          {{ champ.champion.name }}
        </div>

        <!-- 마스터리 포인트 -->
        <div class="text-xs text-gray-400 mt-0.5">
          {{ champ.championPoints.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  console.log('mastries');

  const route = useRoute();
  const masteries = ref([]);

  const getChampionImage = (championImage) => {
    return require('@/assets/img/champion/'+championImage);
  };

  const getMasteryEmblem = (championLevel) => {
    if(championLevel > 10) {
      championLevel = 10;
    }

    return require('@/assets/img/masteries_image/mastery-'+championLevel+'.png');
  }

  onMounted(async () => {
    const { gameName, tagLine } = route.query;
    console.log("랭크 검색 : "+gameName+"#"+tagLine);
    try {
        const res = await axios.get(`http://localhost:8080/opgg/riotapi/getMasteriesWithGameName/${gameName}/${tagLine}`)
        console.log(res);
        masteries.value = res.data;
    } catch (e) {
        console.error('전적 조회 실패:', e)
    }
  });
</script>