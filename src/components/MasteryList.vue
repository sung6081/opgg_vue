<template>
  <div class="p-6 max-w-6xl mx-auto text-white" style="padding-top: 0px;">

    <h2 class="text-2xl font-bold mb-6 text-center">숙력도 정보</h2>

    <!-- 로딩창 -->
    <div id="areaLoading" role="status" class="flex items-center justify-center z-50" style="margin-bottom: 20px;">
      <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

    <div class="flex justify-between items-end flex-wrap gap-6">
      <div
        v-for="(champ, index) in masteries.slice(0, length)"
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
        <div class="relative w-12 h-12 mx-auto -mt-3">
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

    <div id="areaBtn" hidden style="margin-top: 20px;">
      <button id="moreBtn" @click="toggleMastery" style="background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ isExpanded ? '접기' : '더보기' }}
      </button>
    </div>

  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import $ from 'jquery';

  console.log('mastries');

  const route = useRoute();
  const masteries = ref([]);
  const length = ref(9);
  const isExpanded = ref(false);

  const getChampionImage = (championImage) => {
    return require('@/assets/img/champion/'+championImage);
  };

  const getMasteryEmblem = (championLevel) => {
    if(championLevel > 10) {
      championLevel = 10;
    }

    return require('@/assets/img/masteries_image/mastery-'+championLevel+'.png');
  }

  // const getMoreMastery = () => {
  //   console.log(length.value);

  //   if(length.value + 9 < masteries.value.length) {
  //     length.value += 9;
  //   }
  //   else {
  //     length.value = masteries.value.length;
  //     $('#moreBtn').text('접기').off('click').on('click', initMastery);
  //   }

  //   console.log(length.value);
  // };

  // const initMastery = () => {
  //   if(length.value > masteries.value.length) {
  //     length.value = masteries.value.length;
  //   }else {
  //     length.value = 9;
  //   }
  //   $('#moreBtn').off('click').on('click', getMoreMastery);
  // };

  const toggleMastery = () => {
    if (!isExpanded.value) {
      length.value = masteries.value.length;
      isExpanded.value = true;
    } else {
      length.value = 9;
      isExpanded.value = false;
    }
  };

  onMounted(async () => {
    const { gameName, tagLine } = route.query;

    console.log("랭크 검색 : "+gameName+"#"+tagLine);
    try {
        const res = await axios.get(`http://localhost:8080/opgg/riotapi/getMasteriesWithGameName/${gameName}/${tagLine}`)
        console.log(res);
        masteries.value = res.data;
        $('#areaLoading').remove();
    } catch (e) {
        console.error('숙련도 조회 실패:', e)
    }

    if(length.value > masteries.value.length) {
      length.value = masteries.value.length;
      $('#moreBtn').remove();
    }

    $('#areaBtn').removeAttr('hidden');

  });
</script>