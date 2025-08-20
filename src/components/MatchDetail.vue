<template>
  <div class="p-6 max-w-4xl mx-auto text-white">
    <!-- 카테고리 필터 버튼 -->
    <div class="flex gap-2 justify-center mb-4 flex-wrap">
      <button
        v-for="mode in gameModes"
        :key="mode"
        @click="selectedMode = mode"
        :class="[
          'px-3 py-1 rounded-lg border',
          selectedMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
        ]"
      >
        {{ mode }}
      </button>
    </div>

    <div v-if="loading" class="text-center text-lg">불러오는 중...</div>
    <div v-else-if="error" class="text-red-400 text-center">{{ error }}</div>

    <div
      v-else
      v-for="(match, index) in filteredMatches"
      :key="match.matchId"
      class="mb-6 bg-gray-800 rounded-xl p-4 shadow"
    >
      <!-- 매치 상단 정보 -->
      <div
        class="flex justify-between items-center cursor-pointer"
        @click="toggleMatch(index)"
      >
        <div>
          <p class="text-xl font-semibold flex items-center gap-2">
            <img
              v-if="getImageExists(getMyChampion(match))"
              :src="getChampionImage(getMyChampion(match))"
              alt="champion"
              class="w-8 h-8 rounded-full border border-white"
              @error="onImgError"
            />
            {{ getMyResult(match) }}
          </p>
          <p>KDA: {{ getMyKDA(match) }}</p>
          <p>
            게임 모드: {{ match.gameMode }} |
            시간: {{ formatDuration(match.gameDuration) }} |
            시작: {{ formatDate(match.gameCreation) }}
          </p>
        </div>
        <svg
          :class="{ 'rotate-180': expandedIndex === index }"
          class="w-6 h-6 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- 상세 정보 영역 -->
      <div v-if="expandedIndex === index" class="mt-4">
        <!-- 블루팀 -->
        <h3 class="text-lg font-bold text-blue-300">블루팀</h3>
        <table class="w-full table-auto text-sm text-center rounded-lg overflow-hidden mb-4"
          :class="getTeamWin(match, 100) ? 'bg-blue-200 text-black' : 'bg-red-200 text-black'">
          <thead class="bg-gray-600 text-white">
            <tr><th>챔피언</th><th>소환사</th><th>K / D / A</th><th>레벨</th><th>아이템</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="p in match.participants.filter(p => p.teamId === 100)"
              :key="p.riotGameName + p.championName"
              :class="{ 'bg-gray-500 font-bold': isMe(p), 'hover:bg-gray-600': true }"
            >
              <td><img v-if="getImageExists(p.championName)" :src="getChampionImage(p.championName)" class="w-6 h-6 rounded-full" @error="onImgError" /></td>
              <td>{{ p.riotGameName }}#{{ p.riotTagLine }}</td>
              <td>{{ p.kills }} / {{ p.deaths }} / {{ p.assists }}</td>
              <td>{{ p.champLevel }}</td>
              <td class="flex justify-center gap-1 flex-wrap">
                <img v-for="(itemId, i) in getItems(p)" :key="i" :src="getItemImage(itemId)" class="w-5 h-5 rounded border" @error="onImgError" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 레드팀 -->
        <h3 class="text-lg font-bold text-red-300">레드팀</h3>
        <table class="w-full table-auto text-sm text-center rounded-lg overflow-hidden"
          :class="getTeamWin(match, 200) ? 'bg-blue-200 text-black' : 'bg-red-200 text-black'">
          <thead class="bg-gray-600 text-white">
            <tr><th>챔피언</th><th>소환사</th><th>K / D / A</th><th>레벨</th><th>아이템</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="p in match.participants.filter(p => p.teamId === 200)"
              :key="p.riotGameName + p.championName"
              :class="{ 'bg-gray-500 font-bold': isMe(p), 'hover:bg-gray-600': true }"
            >
              <td><img v-if="getImageExists(p.championName)" :src="getChampionImage(p.championName)" class="w-6 h-6 rounded-full" @error="onImgError" /></td>
              <td>{{ p.riotGameName }}#{{ p.riotTagLine }}</td>
              <td>{{ p.kills }} / {{ p.deaths }} / {{ p.assists }}</td>
              <td>{{ p.champLevel }}</td>
              <td class="flex justify-center gap-1 flex-wrap">
                <img v-for="(itemId, i) in getItems(p)" :key="i" :src="getItemImage(itemId)" class="w-5 h-5 rounded border" @error="onImgError" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matches: [],
      myGameName: '',
      myTagLine: '',
      expandedIndex: null,
      loading: true,
      error: null,
      imageCache: {},
      selectedMode: '전체', // ✅ 선택된 모드
      gameModes: ['전체', 'CLASSIC', 'ARAM', 'URF'], // ✅ 보여줄 모드들
    };
  },
  computed: {
    filteredMatches() {
      if (this.selectedMode === '전체') return this.matches;
      return this.matches.filter(m => m.gameMode === this.selectedMode);
    }
  },
  mounted() {
    const gameName = this.$route.query.gameName;
    const tagLine = this.$route.query.tagLine;

    if (!gameName || !tagLine) {
      this.error = "잘못된 접근입니다.";
      this.loading = false;
      return;
    }

    this.myGameName = gameName;
    this.myTagLine = tagLine;

    fetch(`http://localhost:8080/opgg/riotapi/getRecentMatches/${gameName}/${tagLine}`)
      .then(res => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.json();
      })
      .then(data => {
        this.matches = data;
      })
      .catch(err => {
        console.error(err);
        this.error = "전적을 불러오지 못했습니다. 소환사명이 올바른지 확인해주세요.";
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    toggleMatch(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    formatDuration(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}분 ${sec}초`;
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    getMyChampion(match) {
      const me = this.getMyParticipant(match);
      return me ? me.championName : "알 수 없음";
    },
    getMyKDA(match) {
      const me = this.getMyParticipant(match);
      return me ? `${me.kills} / ${me.deaths} / ${me.assists}` : "-";
    },
    getMyResult(match) {
      const me = this.getMyParticipant(match);
      return me ? (me.win ? "승리" : "패배") : "결과 없음";
    },
    getMyParticipant(match) {
      return match.participants.find(
        p =>
          p.riotGameName?.toLowerCase() === this.myGameName.toLowerCase() &&
          p.riotTagLine?.toLowerCase() === this.myTagLine.toLowerCase()
      );
    },
    isMe(p) {
      return (
        p.riotGameName?.toLowerCase() === this.myGameName.toLowerCase() &&
        p.riotTagLine?.toLowerCase() === this.myTagLine.toLowerCase()
      );
    },
    getChampionImage(championName) {
      const cleanName = championName?.replace(/\s+/g, "").replace(/[^\w]/g, "");
      return require(`@/assets/img/champion/${cleanName}.png`);
    },
    getItemImage(itemId) {
      try {
        return require(`@/assets/img/item/${itemId}.png`);
      } catch (e) {
        return '';
      }
    },
    getImageExists(championName) {
      const cleanName = championName?.replace(/\s+/g, "").replace(/[^\w]/g, "");

      if (this.imageCache[cleanName] !== undefined) {
        return this.imageCache[cleanName];
      }

      try {
        require(`@/assets/img/champion/${cleanName}.png`);
        this.imageCache[cleanName] = true;
        return true;
      } catch (e) {
        this.imageCache[cleanName] = false;
        return false;
      }
    },
    onImgError(event) {
      event.target.style.display = "none";
    },
    getTeamWin(match, teamId) {
      const player = match.participants.find(p => p.teamId === teamId);
      return player?.win === true;
    },
    getItems(p) {
      return Array.from({ length: 7 })
        .map((_, i) => p[`item${i}`])
        .filter(id => id && id !== 0);
    }
  }
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
