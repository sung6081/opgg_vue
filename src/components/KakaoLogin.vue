<template>
  <button @click="loginWithKakao" class="bg-yellow-300 px-4 py-2 rounded">
    카카오로 로그인
  </button>
</template>

<script>
export default {
  mounted() {
    console.log('✅ 컴포넌트 마운트됨 - Kakao SDK 상태 확인 중...')
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.VUE_APP_KAKAO_JS_KEY)
      console.log('📦 Kakao SDK 초기화 완료:', window.Kakao.isInitialized())
    } else if (!window.Kakao) {
      console.warn('⚠️ Kakao SDK가 로드되지 않았습니다.')
    } else {
      console.log('ℹ️ Kakao SDK 이미 초기화되어 있음.')
    }
  },
  methods: {
    loginWithKakao() {
      console.log('👆 카카오 로그인 버튼 클릭됨')

      if (!window.Kakao) {
        alert('❌ Kakao SDK가 아직 로드되지 않았습니다.')
        return
      }

      window.Kakao.Auth.login({
        scope: 'profile_nickname,profile_image', // 필수 스코프
        success: (authObj) => {
          console.log('✅ 카카오 로그인 성공, access_token:', authObj.access_token)

          // 사용자 정보 요청
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: async (res) => {
              console.log('📦 사용자 정보:', res)

              const userData = {
                profile_nickname: res.properties?.nickname,
                profile_image: res.properties?.profile_image
              }

              await this.sendToServer(userData)
            },
            fail: (err) => {
              console.error('❌ 사용자 정보 요청 실패:', err)
            }
          })
        },
        fail: (err) => {
          console.error('❌ 카카오 로그인 실패:', err)
        }
      })
    },

    async sendToServer(userData) {
      console.log('📡 사용자 데이터 전송:', userData)
      try {
        const res = await fetch('http://localhost:8080/oauth/kakao/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })

        if (!res.ok) {
          console.error('❌ 서버 응답 에러:', res.status, res.statusText)
          return
        }

        const result = await res.text()
        console.log('✅ 서버 응답:', result)
        alert(result)
      } catch (err) {
        console.error('❌ 백엔드 통신 실패:', err)
      }
    }
  }
}
</script>
