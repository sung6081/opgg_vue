<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100" style="background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));">
    <!-- 이미지 -->
    <img src="@/assets/poro.png" alt="Poro" class="mb-6 w-148 h-auto" />

    <div class="w-full max-w-2xl px-4">
      <div class="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden">
        <!-- 태그 입력 영역 (왼쪽) -->
        <div class="flex items-center w-1/2 border-r border-gray-300 px-4 py-4">
          <input
            v-model="searchText"
            @input="handleInputChange"
            @compositionend="handleInputChange"
            type="text"
            placeholder="플레이어"
            class="w-full text-lg focus:outline-none"
            id="player"
          />
        </div>

        <!-- 플레이어 입력 영역 (오른쪽) -->
        <span class="text-gray-500 mr-2">#</span>
        <input
          v-model="tagText"
          type="text"
          placeholder="태그"
          class="w-1/2 py-4 text-lg focus:outline-none"
          id="tag"
>>>>>>>>> Temporary merge branch 2
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

      <ul v-if="accounts.length" class="mt-6 space-y-4">
      <li @click="autoSearchCliked(a.puuid, $event)" v-for="a in accounts" :key="a.puuid" class="flex items-center bg-white rounded-xl shadow-md p-4" style="margin-top: 1px;">
        <!-- 이미지 -->
        <img
          :src="getProfileIconUrl(a.profileIconId)"
          class="w-14 h-14 rounded-full border border-gray-300 mr-4"
        />

        <!-- 텍스트 정보 -->
        <div>
          <div class="text-lg font-bold text-black cursor-pointer">
            {{ a.gameName }} <span class="font-normal text-gray-700">#{{ a.tagLine }}</span>
          </div>
          <div class="text-sm text-gray-500">Level {{ a.summonerLevel }}</div>
        </div>
      </li>
    </ul>

    </div>
  </div>
</template>

<!-- <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 

const searchText = ref('')
const tagText = ref('')
const router = useRouter() 

const handleSearch = () => {
  if (!searchText.value || !tagText.value) {
    alert('플레이어와 태그를 모두 입력해주세요.')
    return
  }

  router.push({
    name: 'MatchDetail', 
    params: {
      gameName: tagText.value,
      tagLine: searchText.value
    }
  })
}
</script> -->

<script>

  import $ from "jquery";

  export default {
    data() {
      return {
        searchText: "",
        tagText: "",
        accounts: []
      };
    },
    methods: {
      handleInputChange(e) {
        console.log("Changed:", this.searchText);
        if(this.searchText == "") {
          this.accounts = [];
        }

        const value = e.target.value;
        this.searchText = value;

        // Ajax 통신 (GET 방식 예시)
        $.ajax({
          url: `http://localhost:8080/opgg/riotapi/getRiotAccountsWithGameNameLike/` + this.searchText,
          method: "GET",
          success: (response) => {
            console.log("백엔드 응답:", response);
            // response 처리 (예: 결과 저장 또는 화면 반영)
            if (Array.isArray(response) && response.length > 0) {
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
        // 검색 버튼 눌렀을 때 처리 (필요 시 handleInputChange 재호출 가능)

        const searchText = document.getElementById("player").value;
        const tagText = document.getElementById("tag").value;

        if (!searchText || !tagText) {
          alert('플레이어와 태그를 모두 입력해주세요.')
          return
        }

        this.searchText = searchText;
        this.tagText = tagText;

        //로직 실행
        const gameName = searchText;
        const tagLine = tagText;
        console.log("gameName : "+gameName);
        console.log("tag : "+ tagLine);
        this.$router.push({
          path: "/search",
          query: {
            gameName: gameName,
            tagLine: tagLine
          }
        });
      },
      getProfileIconUrl(iconId) {
        if(iconId < 0) {
          return 'https://cdn.dak.gg/lol/images/summoner/profile_icon_null.jpg';
        }
        return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/profileicon/${iconId}.png`;
      },
      autoSearchCliked(puuid, e) {
        const clickedText = $(e.target).text(); // e.g. "Hide on bush #KR1"
        // $('input').val(clickedText); // input DOM에 값만 넣음
        // this.searchText = clickedText; // Vue data도 동기화
        // $('button').click();
        //로직 실행
          const parts = clickedText.split("#");
          const gameName = parts[0];
          const tagLine = parts[1];
          console.log("gameName : "+gameName);
          console.log("tag : "+ tagLine);
          console.log("puuid : " + puuid);
        this.$router.push({
            path: "/search",
            query: {
              gameName,
              tagLine,
              puuid
            }
          });
      }
    }
  };

</script>