<template>
    <div>
        LotationChamps
    </div>
</template>

<script setup>

    //import $ from "jquery";
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    
    console.log('rotation');

    const champs = ref([]);

    onMounted(async () => {

    try {
        const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRotationChamps`)
        console.log(res);
        champs.value = res.data;
    } catch (e) {
        console.error('로테이션 조회 실패:', e)
    }

    

  });

</script>