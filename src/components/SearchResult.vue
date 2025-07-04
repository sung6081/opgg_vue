<template>
  <div class="min-h-screen bg-gray-900 text-white px-6 py-8">
    
    <!-- 유저 기본 정보 (상단) -->
    <div class="flex items-center justify-center space-x-6 mb-10">
      <!-- 프로필 아이콘 -->
      <div class="relative">
        <img
          :src="getProfileIconUrl(profileIconId)"
          alt="Profile Icon"
          class="w-24 h-24 rounded-lg border-2 border-gray-700"
        />
        <div class="absolute bottom-0 right-0 bg-gray-800 text-white text-sm px-2 py-0.5 rounded-full">
          {{ summonerLevel }}
        </div>
      </div>

      <!-- 유저 정보 -->
      <div>
        <div class="flex items-center space-x-2 text-2xl font-bold">
          <span>{{ gameName }}</span>
          <span class="text-gray-400">#{{ tagLine }}</span>
        </div>
        <div class="text-sm text-gray-300 mt-1">
          <img src="https://flagcdn.com/w40/kr.png" class="inline w-5 h-3 mr-1" />
          KR
        </div>
      </div>
    </div>

    <!-- 하단: 랭크 정보 + 전적 정보 -->
    <div class="flex gap-8">
      <!-- 좌측: RankInfo -->
      <div class="w-1/4">
        <RankInfo />
      </div>

      <!-- 우측: MatchDetail -->
      <div class="w-3/4">
        <Masteries />
        <MatchDetail />
      </div>

    </div>
  </div>
</template>

<script>

    import $ from "jquery";
    import MatchDetail from "./MatchDetail.vue";
    import RankInfo from "./RankInfo.vue";
    import Masteries from "./Masteries.vue"

    export default {

        components: {
            MatchDetail,
            RankInfo,
            Masteries
        },

        data() {
            return {
                profileIconId: null,
                summonerLevel: null,
                puuid: null,
                gameName: "",
                tagLine: ""
            };
        },

        methods: {
            getProfileIconUrl(iconId) {
                if(iconId < 0) {
                    return 'https://cdn.dak.gg/lol/images/summoner/profile_icon_null.jpg';
                }
                return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/profileicon/${iconId}.png`;
            }
        },

        mounted() {
            const gameName = this.$route.query.gameName;
            const tagLine = this.$route.query.tagLine;
            const puuid = this.$route.query.puuid;
            console.log("받은 값: " + gameName + "#" + tagLine);

            let url = "";

            if (puuid === undefined) {
                url = `http://localhost:8080/opgg/riotapi/getRiotAccountWithGameName/${gameName}/${tagLine}`;
            } else {
                url = `http://localhost:8080/opgg/riotapi/getRiotAccountWithPPuid/${puuid}`;
            }

            $.ajax({
                    url: url,
                    method: "GET",
                    async: false, // ❗가능하면 async: false는 제거하고, async/await를 추천합니다
                    success: (response) => {
                    console.log("백엔드 응답:", response);
                    if(response == null || response == undefined) {
                        this.$route.push({ path: '/notfound' });
                    }
                    this.profileIconId = response.profileIconId;
                    this.summonerLevel = response.summonerLevel;
                    this.gameName = response.gameName;
                    this.tagLine = response.tagLine;
                    this.puuid = response.puuid;
                },
                error: (error) => {
                    console.error("요청 실패:", error);
                    this.$router.push({ path: '/notfound' });
                }
            });

            
        }
    }

</script>