<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
    <!-- 이미지 -->
    <img src="@/assets/poro.png" alt="Poro" class="mb-10 w-148 h-auto" />

    <div class="w-full max-w-2xl px-4">
      <!-- 검색 입력 필드 -->
      <div class="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden">
        <input
          v-model="fullSearchText"
          @input="handleInputChange"
          @compositionend="handleInputChange"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="플레이어명#태그"
          class="w-full px-5 py-4 text-lg text-gray-900 focus:outline-none focus:ring focus:ring-blue-250 rounded-full"
          id="full-search"
        />

        <!-- 검색 버튼 -->
        <button
          @click="handleSearch"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-full flex items-center justify-center"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"
            />
          </svg>
        </button>
      </div>

      <!-- 자동완성 리스트 -->
      <ul v-if="accounts.length" class="mt-6 space-y-4">
        <li
          @click="autoSearchCliked(a.puuid, $event)"
          v-for="a in accounts"
          :key="a.puuid"
          class="flex items-center bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-gray-100 transition"
        >
          <img
            :src="getProfileIconUrl(a.profileIconId)"
            class="w-14 h-14 rounded-full border border-gray-300 mr-4"
          />
          <div>
            <div class="text-lg font-bold text-black">
              {{ a.gameName }} <span class="font-normal text-gray-700">#{{ a.tagLine }}</span>
            </div>
            <div class="text-sm text-gray-500">Level {{ a.summonerLevel }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      fullSearchText: "",
      accounts: []
    };
  },
  methods: {
    handleInputChange(e) {
      const value = e.target.value;
      this.fullSearchText = value;

      const [gameName] = value.split("#");
      if (!gameName || gameName.trim() === "") {
        this.accounts = [];
        return;
      }

      // Ajax 요청
      $.ajax({
        url: `http://localhost:8080/opgg/riotapi/getRiotAccountsWithGameNameLike/${gameName}`,
        method: "GET",
        success: (response) => {
          if (Array.isArray(response)) {
            this.accounts = response;
          } else {
            this.accounts = [];
          }
        },
        error: (error) => {
          console.error("요청 실패:", error);
        }
      });
    },
    handleSearch() {
      if (!this.fullSearchText.includes("#")) {
        alert("플레이어명과 태그를 '#'로 구분해서 입력해주세요.");
        return;
      }

      const [gameNameRaw, tagLineRaw] = this.fullSearchText.split("#");
      const gameName = gameNameRaw?.trim();
      const tagLine = tagLineRaw?.trim();

      if (!gameName || !tagLine) {
        alert("플레이어명과 태그를 모두 입력해주세요.");
        return;
      }

      console.log("gameName:", gameName);
      console.log("tagLine:", tagLine);

      this.$router.push({
        path: "/search",
        query: { gameName, tagLine }
      });
    },
    autoSearchCliked(puuid, e) {
      const clickedText = $(e.target).text(); // e.g. "Hide on bush #KR1"
      const [gameNameRaw, tagLineRaw] = clickedText.split("#");
      const gameName = gameNameRaw?.trim();
      const tagLine = tagLineRaw?.trim();

      if (!gameName || !tagLine) return;

      this.$router.push({
        path: "/search",
        query: {
          gameName,
          tagLine,
          puuid
        }
      });
    },
    getProfileIconUrl(iconId) {
      return iconId < 0
        ? 'https://cdn.dak.gg/lol/images/summoner/profile_icon_null.jpg'
        : `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/profileicon/${iconId}.png`;
    }
  }
};
</script>

<style scoped>
/* 필요 시 추가 커스터마이징 가능 */
</style>
