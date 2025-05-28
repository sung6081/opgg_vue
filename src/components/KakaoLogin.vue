<template>
  <button @click="loginWithKakao" class="bg-yellow-300 px-4 py-2 rounded">
    카카오로 로그인
  </button>
</template>

<script>
export default {
  mounted() {
    // Kakao SDK가 로드됐는지 확인
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.VUE_APP_KAKAO_JS_KEY)
      console.log('Kakao SDK 초기화 완료')
    }
  },
  methods: {
    loginWithKakao() {
      if (!window.Kakao || !window.Kakao.Auth) {
        alert('카카오 SDK가 아직 로드되지 않았습니다.')
        return
      }

      window.Kakao.Auth.login({
        scope: 'profile_nickname,account_email',
        success: (authObj) => {
          console.log('access_token:', authObj.access_token)
          this.sendToServer(authObj.access_token)
        },
        fail: (err) => {
          console.error('카카오 로그인 실패', err)
        }
      })
    },
    async sendToServer(accessToken) {
      try {
        const res = await fetch('http://localhost:8080/auth/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken })
        })
        const data = await res.json()
        console.log('서버 응답:', data)
      } catch (err) {
        console.error('백엔드 통신 실패', err)
      }
    }
  }
}
</script>
