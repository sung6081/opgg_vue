<template>

    <div class="min-h-screen bg-gray-900 text-white px-6 py-8">
        <!-- 페이지 이름 (상단) -->
        <!-- <div class="flex items-center justify-center space-x-6 mb-10">
            <h2 class="text-2xl font-bold mb-6 text-center">챔피언 정보</h2>
        </div> -->

        <!-- 하단: 챔피언 리스트 + 챔피언 자세히 -->
        <div class="flex gap-8">
        <!-- 좌측: 챔피언 리스트 -->
        <div class="w-1/3 ml-[10px]">
            <h3 class="text-sm font-semibold text-gray-300 mb-2">챔피언 리스트</h3>
            
            <!-- 챔피언 리스트 이미지 영역 -->
            <!-- 스크롤 가능한 영역 -->
            <div
                class="flex flex-wrap gap-2 overflow-y-auto h-[600px] pr-2 scrollbar-left"
            >
                <div
                    v-for="(champ, index) in champions"
                    @click="changeChampInfo(champ)"
                    :key="index"
                    class="w-24 text-center relative"
                    style="cursor: pointer;"
                    :title="`${champ.name}`"
                >
                    <img
                        :src="getChampionImage(champ.image)"
                        alt="champ"
                        class="w-auto h-auto rounded-md mx-auto"
                    />
                    <svg
                        v-if="champ.rotation"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        class="absolute top-0 right-0 text-white z-10 bg-black rounded-full p-0.5"
                    >
                        <path
                            fill="currentColor"
                            fill-rule="nonzero"
                            d="M14 2c2.21 0 4 1.79 4 4h-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-1.995 1.85L8 6v2h10a2 2 0 0 1 2 2v7.641a2 2 0 0 1-1.268 1.862l-6 2.358a2 2 0 0 1-1.464 0l-6-2.358A2 2 0 0 1 4 17.64V10a2 2 0 0 1 2-2V6c0-2.21 1.79-4 4-4zm-2 10a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 12"
                        />
                    </svg>
                    <div class="mt-1 text-sm font-semibold truncate w-24">
                        {{ champ.name }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 우측: 챔피언 자세히 -->
        <div
            v-if="champInfo != null && champInfo != undefined" 
            class="w-2/3">
            <h3 class="text-sm font-semibold text-gray-300 mb-2 text-center"><span style="color: khaki;">{{ champInfo.title }}</span></h3>

            <div>
                <!-- <img
                    :src="getChampionImageSprite(champInfo.sprite)"
                    alt="선택된 챔피언"
                    class="w-auto h-[350px] rounded-lg shadow-lg mb-4 mx-auto"
                /> -->

                <!-- carousel -->
                 <div class="relative w-[500px] h-auto overflow-visible mx-auto mt-4">
                    <div id="default-carousel" class="relative" data-carousel="static">
                    <!-- Carousel items -->
                    <div class="relative w-[500px] h-auto overflow-hidden rounded-xl">
                        <div
                        :class="currentIndex === index ? 'block duration-700 ease-in-out' : 'hidden duration-700 ease-in-out'"
                        v-for="(skin, index) in champInfo.skins"
                        :key="index"
                        >
                        <img
                            :src="getCarouselImage(skin.num, champInfo.id)"
                            class="block w-full h-full object-cover rounded-xl transition-all"
                            alt="carousel"
                        />
                        <div class="text-lg font-bold text-white text-center" style="margin-bottom: 10px;">
                            {{ skin.name === 'default' ? champInfo.name : skin.name }}
                        </div>
                        </div>
                    </div>

                    <!-- Carousel controls -->
                    <button
                        @click="prev"
                        type="button"
                        class="absolute top-1/2 -left-16 transform -translate-y-1/2 z-20"
                    >
                        <span class="inline-flex items-center justify-center w-10 h-10 bg-white/30 group-hover:bg-white/50 rounded-full">
                        ‹
                        </span>
                    </button>
                    <button
                        @click="next"
                        type="button"
                        class="absolute top-1/2 -right-16 transform -translate-y-1/2 z-20"
                    >
                        <span class="inline-flex items-center justify-center w-10 h-10 bg-white/30 group-hover:bg-white/50 rounded-full">
                        ›
                        </span>
                    </button>
                    </div>
                </div>

                <!-- 스킬 이미지 목록 -->
                <div class="flex gap-2 items-center justify-center flex-wrap">
                    <!-- 패시브 스킬 -->
                    <div class="relative group flex flex-col items-center">
                        <img
                            :src="getPassiveImage(champInfo.passiveImage)"
                            alt="패시브"
                            class="w-24 h-24 rounded-md border border-yellow-400"
                        />
                        <span class="text-xl text-gray-400 mt-1" style="color: khaki;">P</span>
                        <!-- 툴팁 -->
                        <div
                            class="absolute bottom-full mb-2 px-2 py-1 w-56 rounded bg-black text-white text-sm text-center
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        >
                            <span class="text-xs text-gray-400 mt-1" style="color: khaki;">{{ champInfo.passive }}</span>
                            <br/>
                            <span class="text-xs text-gray-400 mt-1" style="color: aliceblue;">{{ champInfo.passiveDescription }}</span>
                        </div>
                    </div>

                    <!-- 일반 스킬들 -->
                    <div
                        v-for="(skill, i) in champInfo.skills"
                        :key="i"
                        class="relative group flex flex-col items-center"
                    >
                        <img
                            :src="getSkillImage(skill.image)"
                            :alt="skill.name"
                            class="w-24 h-24 rounded-md border border-blue-400"
                            :title="skill.name"
                        />
                        <span class="text-xl text-gray-400 mt-1">
                            {{ ['Q', 'W', 'E', 'R'][i] }}
                        </span>
                        <!-- 툴팁 -->
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2 z-50
                            bg-gray-900 text-white p-4 rounded-lg w-[400px] shadow-lg space-y-3
                        hidden group-hover:block">
                            <!-- 스킬명 -->
                            <div class="text-yellow-400 text-xl font-bold">{{ skill.name }}</div>

                            <!-- 기본 정보 -->
                            <div class="text-sm space-y-0.5 text-gray-300">
                                <div><strong>범위:</strong> {{ skill.rangeBurn }}</div>
                                <div><strong>소모값:</strong> {{ skill.costBurn || '소모값 없음' }}</div>
                                <div><strong>쿨타임:</strong> {{ skill.cooldownBurn }}</div>
                            </div>

                            <!-- 설명 -->
                            <div class="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
                                {{ skill.description }}
                            </div>

                            <!-- 주의사항 -->
                            <div v-if="skill.tooltip" v-html="skill.tooltip" class="text-xs text-yellow-400 border-t border-gray-600 pt-2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    </div>

</template>

<script>

    //import $ from "jquery";
    //import { ref } from 'vue';
    import axios from 'axios';

    console.log('champion list');

    export default{

        data() {
            return {
                rotations: null,
                champions: null,
                original: null,
                champInfo: null,
                defaultName: null,
                currentIndex: 0
            };
        },

        methods: {

            getChampionImage(championImage) {
                return require('@/assets/img/champion/'+championImage);
            },
            // getChampionImageSprite(championSpriteImage) {
            //     if(championSpriteImage.split("_")[0] == 'Fiddlesticks') {
            //         championSpriteImage = 'FiddleSticks' + "_" + championSpriteImage.split("_")[1];
            //     }
            //     return require('@/assets/img/champion/splash/'+championSpriteImage);
            // },
            getCarouselImage(skinNum, championName) {
                if(championName == 'Fiddlesticks') {
                    championName = 'FiddleSticks';
                }

                const img = championName + "_" + skinNum + '.jpg';

                //console.log(img);

                return require('@/assets/img/champion/splash/' + img);
            },
            changeChampInfo(champ) {
                this.champInfo = champ;
                this.defaultName = this.champInfo.name;
                this.currentIndex = 0;
                console.log("changed info : ");
                console.log(this.champInfo);
            },
            getPassiveImage(passiveImage) {
                return require('@/assets/img/passive/'+passiveImage);
            },
            getSkillImage(skillImage) {
                return require('@/assets/img/spell/'+skillImage);
            },
            next() {
                if (!this.champInfo?.skins?.length) return;
                this.currentIndex = (this.currentIndex + 1) % this.champInfo.skins.length;
            },
            prev() {
                if (!this.champInfo?.skins?.length) return;
                this.currentIndex =
                (this.currentIndex - 1 + this.champInfo.skins.length) %
                this.champInfo.skins.length;
            }

        },

        async mounted() {

            //로테이션 챔프들 가져오기
            // try {
            //     const res = await axios.get(`http://localhost:8080/opgg/riotapi/getRotationChamps`);
            //     //console.log(res);
            //     this.rotations = res.data;
            //     console.log(this.rotations);
            // } catch (e) {
            //     console.error('로테이션 조회 실패:', e)
            // }

            //다 가져오기
            try{
                const res = await axios.get('http://localhost:8080/opgg/riotapi/getAllChamps');
                this.champions = res.data;
                this.champions.sort((a, b) => a.name.localeCompare(b.name));
                this.original = this.champions;
                this.champInfo = this.champions[0];
                this.defaultName = this.champInfo.name;
                console.log(this.champions);
                console.log(this.champInfo);
            } catch (e) {
                console.error('전체 챔피언 조회 실패:', e)
            }

        }

    }

</script>