<template>
  <div class="p-6 max-w-6xl mx-auto">
    masterie
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  console.log('mastries');

  const route = useRoute();
  const masteries = ref([]);

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