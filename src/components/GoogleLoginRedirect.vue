<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-gray-700 text-lg">구글 로그인 처리 중...</p>
  </div>
</template>

<script>
export default {
  name: 'GoogleLoginRedirect',
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      alert("인증 코드가 없습니다.");
      this.$router.push('/login');
      return;
    }

    try {
      // 백엔드로 code 전송 → 이메일 리턴 받기
      const response = await fetch(`http://localhost:8080/oauth/google?code=${code}`);
      
      if (!response.ok) {
        throw new Error("서버 오류");
      }

      const email = await response.text(); // 백엔드에서 email을 문자열로 보낸다고 가정
      console.log("✅ 로그인된 사용자 이메일:", email);

      // 이메일을 localStorage 또는 store에 저장
      localStorage.setItem("userEmail", email);

      // 홈으로 이동
      this.$router.push('/');
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      alert("구글 로그인 중 오류가 발생했습니다.");
      this.$router.push('/login');
    }
  }
};
</script>