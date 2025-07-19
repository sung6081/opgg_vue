<template>
  <div class="p-6 max-w-4xl mx-auto text-white">
    <h2 class="text-2xl font-bold mb-6 text-center">전적 정보</h2>

    <div v-if="loading" class="text-center text-lg">불러오는 중...</div>
    <div v-else-if="error" class="text-red-400 text-center">{{ error }}</div>

    <div
      v-else
      v-for="(match, index) in matches"
      :key="match.matchId"
      class="mb-6 bg-gray-800 rounded-xl p-4 shadow"
    >
      <div
        class="flex justify-between items-center cursor-pointer"
        @click="toggleMatch(index)"
      >
        <div>
          <p class="text-xl font-semibold">
            {{ getMyChampion(match) }} - {{ getMyResult(match) }}
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

      <div v-if="expandedIndex === index" class="mt-4">
        <table class="w-full table-auto text-sm text-center bg-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-600 text-white">
            <tr>
              <th>소환사</th>
              <th>챔피언</th>
              <th>K / D / A</th>
              <th>레벨</th>
              <th>승리</th>
              <th>팀</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in match.participants"
              :key="p.riotGameName + p.championName"
              :class="{
                'bg-gray-500 font-bold': isMe(p),
                'hover:bg-gray-600': true
              }"
            >
              <td>{{ p.riotGameName }}#{{ p.riotTagLine }}</td>
              <td>{{ p.championName }}</td>
              <td>{{ p.kills }} / {{ p.deaths }} / {{ p.assists }}</td>
              <td>{{ p.champLevel }}</td>
              <td :class="{ 'text-green-400': p.win, 'text-red-400': !p.win }">
                {{ p.win ? "승리" : "패배" }}
              </td>
              <td>{{ p.teamId }}</td>
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
      error: null
    };
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
      return date.toLocaleString(); // yyyy. mm. dd. hh:mm 형식
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
    }
  }
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
