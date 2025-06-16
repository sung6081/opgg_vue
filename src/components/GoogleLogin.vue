<template>
    <button @click="googleLogin" class="bg-white px-4 py-2 rounded border border-gray-400">
        구글로 로그인
    </button>
</template>

<script>
export default {
  methods: {
    googleLogin() {
      const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
      const redirectUri = 'http://localhost:3000/redirect';
      const responseType = 'code';
      const scope = 'openid profile email';
      const state = 'xyz123'; // 필요시 CSRF 방지용

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=${responseType}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}` +
        `&access_type=offline` +
        `&prompt=consent`;

      window.location.href = authUrl; // 구글 로그인 페이지로 이동
    }
  }
}
</script>